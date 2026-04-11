import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/interfaces/DAOFactory";
import { AuthDAO } from "../dao/interfaces/AuthDAO";
import { FeedDAO } from "../dao/interfaces/FeedDAO";
import { FollowDAO } from "../dao/interfaces/FollowDAO";
import { StatusDAO } from "../dao/interfaces/StatusDAO";
import { FollowData } from "../domain/FollowData";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class StatusService implements Service {
    private _feedDao: FeedDAO;
    private _statusDao: StatusDAO;
    private _followDao: FollowDAO;
    private _authDao: AuthDAO;
    private _postStatusQueueUrl: string = process.env.POST_STATUS_QUEUE_URL!;
    private _updateFeedQueueUrl: string = process.env.UPDATE_FEED_QUEUE_URL!;
    private sqsClient = new SQSClient();


    public constructor(daoFactory: DAOFactory) {
        this._feedDao = daoFactory.feedDAO();
        this._statusDao = daoFactory.statusDAO();
        this._followDao = daoFactory.followDAO();
        this._authDao = daoFactory.authDAO();
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {

        const feedItemsPage = await this._feedDao.readBatchFeedItems(userAlias, pageSize, lastItem ? Status.fromDto(lastItem)! : null);

        const dtos = feedItemsPage.values.map((s: Status) => s.dto);
        const hasMore = feedItemsPage.hasMorePages;

        return [dtos, hasMore];
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {

        const storyItemsPage = await this._statusDao.readBatchStatuses(userAlias, pageSize, lastItem ? Status.fromDto(lastItem)! : null);

        const dtos = storyItemsPage.values.map((s: Status) => s.dto);
        const hasMore = storyItemsPage.hasMorePages;

        return [dtos, hasMore];
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {

        if (newStatus === undefined || newStatus === null || newStatus.post === undefined || newStatus.post === null) {
            throw new Error("bad-request: no status.");
        }

        const authData = await this._authDao.readAuth(token);
        const alias = authData ? authData.userAlias : null;

        const status = Status.fromDto(newStatus);

        await this._statusDao.createStatus(status!);

        const payload = {
            status: status!.toJson(),
        };

        await this.sendToQueue(payload, this._postStatusQueueUrl);
    }

    public async sqsBatchFollowers(status: Status) { // gets followers in batches and sends them and the post to SQS for batch feed updates
        let lastFollowerAlias: string | null = null;
        while (true) { // update feeds of followers in batches until all followers have been updated
            const pageFollows = await this._followDao.readBatchFollowers(status.user.alias!, 25, lastFollowerAlias);
            if (pageFollows.values.length === 0) {
                break;
            }

            const pageFollowerAliases = pageFollows.values.map((f: FollowData) => f.follower.alias);

            lastFollowerAlias = pageFollows.values[pageFollows.values.length - 1].follower.alias;

            const payload = {
                status: status.toJson(),
                aliases: pageFollowerAliases
            };

            await this.sendToQueue(payload, this._updateFeedQueueUrl);
        }
    }

    public async sqsBatchUpdateFeeds(status: Status, followerAliases: string[]) { // triggered by SQS messages, performs batch feed updates
        await this._feedDao.updateFollowerFeeds(followerAliases, status);
    }

    private async sendToQueue(payload: any, queueUrl: string): Promise<void> {
        const params = {
            MessageBody: JSON.stringify(payload),
            QueueUrl: queueUrl,
        };

        try {
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            console.log("Success, message sent. MessageID:", data.MessageId);
        } catch (err) {
            throw Error(`bad-request: got error ${err}`);
        }
    }

    // private async getFakeData(
    //     lastItem: StatusDto | null,
    //     pageSize: number
    // ): Promise<[StatusDto[], boolean]> {
    //     const [items, hasMore] =
    //         FakeData.instance.getPageOfStatuses(
    //             lastItem ? Status.fromDto(lastItem) : null,
    //             pageSize
    //         );

    //     const dtos: StatusDto[] = items.map((status) => status.dto);

    //     return [dtos, hasMore];
    // }
}
import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthDAO } from "../dao/AuthDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { StatusDAO } from "../dao/StatusDAO";
import { FollowData } from "../domain/FollowData";

export class StatusService implements Service {
    private _feedDao: FeedDAO;
    private _statusDao: StatusDAO;
    private _followDao: FollowDAO;
    private _authDao: AuthDAO;


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

        let lastFollowerAlias: string | null = null;

        while (true) { // update feeds of followers in batches until all followers have been updated
            const pageFollows = await this._followDao.readBatchFollowers(alias!, 25, lastFollowerAlias);
            const pageFollowerAliases = pageFollows.values.map((f: FollowData) => f.follower.alias);

            await this._feedDao.updateFollowerFeeds(pageFollowerAliases, status!);

            lastFollowerAlias = pageFollows.values[pageFollows.values.length - 1].follower.alias;

            if (!pageFollows.hasMorePages) {
                break;
            }
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
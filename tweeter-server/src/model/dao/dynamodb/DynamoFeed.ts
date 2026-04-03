import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import { DataPage } from "../../domain/DataPage";
import { FeedDAO } from "../interfaces/FeedDAO";

export class DynamoFeed implements FeedDAO {
    private tableName = "feed";
    private userAliasAttr = "user_alias"; // partition key (feed owner)
    private firstNameAttr = "first_name";
    private lastNameAttr = "last_name";
    private posterAliasAttr = "poster_alias"; // poster's alias
    private imageUrlAttr = "image_url";
    private timestampAttr = "timestamp";
    private postAttr = "post";

    constructor(private client: DynamoDBDocumentClient) { }

    async updateFollowerFeeds(followerAliases: string[], status: Status): Promise<void> {
        const requests = followerAliases.map(alias =>
            this.client.send(
                new PutCommand({
                    TableName: this.tableName,
                    Item: this.toItem(status, alias),
                })
            )
        );
        await Promise.all(requests);
    }

    async readBatchFeedItems(alias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.userAliasAttr} = :alias`,
            ExpressionAttributeValues: {
                ":alias": alias,
            },
            Limit: pageSize,
            ExclusiveStartKey: lastItem
                ? {
                    [this.userAliasAttr]: alias,
                    [this.timestampAttr]: lastItem.timestamp,
                }
                : undefined,
            ScanIndexForward: false,
        };

        const data = await this.client.send(new QueryCommand(params));
        const items = data.Items?.map(i => this.fromItem(i)) ?? [];
        const hasMorePages = data.LastEvaluatedKey !== undefined;

        return new DataPage(items, hasMorePages);
    }

    private toItem(status: Status, feedOwner: string) {
        return {
            [this.userAliasAttr]: feedOwner,             // partition key: whose feed this is
            [this.posterAliasAttr]: status.user.alias,   // the actual poster
            [this.firstNameAttr]: status.user.firstName,
            [this.lastNameAttr]: status.user.lastName,
            [this.imageUrlAttr]: status.user.imageUrl,
            [this.timestampAttr]: status.timestamp,
            [this.postAttr]: status.post,
        };
    }

    private fromItem(item: any): Status {
        return new Status(
            item[this.postAttr],
            new User(
                item[this.firstNameAttr],
                item[this.lastNameAttr],
                item[this.posterAliasAttr],  // poster's alias
                item[this.imageUrlAttr]
            ),
            item[this.timestampAttr]
        );
    }
}
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";
import { DataPage } from "../../domain/DataPage";
import { FeedDAO } from "../interfaces/FeedDAO";

export class DynamoFeed implements FeedDAO {
    private tableName = "feed";
    private userAliasAttr = "user_alias"; // follower
    private timestampAttr = "timestamp";
    private postAttr = "post";

    constructor(private client: DynamoDBDocumentClient) {}

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
            [this.userAliasAttr]: feedOwner,
            [this.timestampAttr]: status.timestamp,
            [this.postAttr]: status.post,
        };
    }

    private fromItem(item: any): Status {
        return new Status(
            item[this.postAttr],
            item[this.userAliasAttr],
            item[this.timestampAttr]
        );
    }
}
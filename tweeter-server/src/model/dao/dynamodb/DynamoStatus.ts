import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";
import { DataPage } from "../../domain/DataPage";
import { StatusDAO } from "../interfaces/StatusDAO";

export class DynamoStatus implements StatusDAO {
    private tableName = "statuses";
    private userAliasAttr = "user_alias";
    private timestampAttr = "timestamp";
    private postAttr = "post";

    constructor(private client: DynamoDBDocumentClient) {}

    async createStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: this.toItem(status),
        };
        await this.client.send(new PutCommand(params));
    }

    async readBatchStatuses(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.userAliasAttr} = :alias`,
            ExpressionAttributeValues: {
                ":alias": userAlias,
            },
            Limit: pageSize,
            ExclusiveStartKey: lastItem
                ? {
                      [this.userAliasAttr]: userAlias,
                      [this.timestampAttr]: lastItem.timestamp,
                  }
                : undefined,
            ScanIndexForward: false, // newest first
        };

        const data = await this.client.send(new QueryCommand(params));
        const items = data.Items?.map(i => this.fromItem(i)) ?? [];
        const hasMorePages = data.LastEvaluatedKey !== undefined;

        return new DataPage(items, hasMorePages);
    }

    async deleteStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.userAliasAttr]: status.user.alias,
                [this.timestampAttr]: status.timestamp,
            },
        };
        await this.client.send(new DeleteCommand(params));
    }

    private toItem(status: Status) {
        return {
            [this.userAliasAttr]: status.user.alias,
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
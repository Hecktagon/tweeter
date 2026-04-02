import { DataPage } from "../../domain/DataPage";
import { FollowData } from "../../domain/FollowData";
import { FollowDAO } from "../interfaces/FollowDAO";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";

export class DynamoFollow implements FollowDAO {
    private tableName: string = "follows"
    private indexName: string = "follows_index"
    private followerAliasAttr: string = "follower_alias" // Partition key
    private followerFirstNameAttr: string = "follower_firstname"
    private followerLastNameAttr: string = "follower_lastname"
    private followerImageUrlAttr: string = "follower_imageurl"
    private followeeAliasAttr: string = "followee_alias" // Sort Key
    private followeeFirstNameAttr: string = "followee_firstname"
    private followeeLastNameAttr: string = "followee_lastname"
    private followeeImageUrlAttr: string = "followee_imageurl"
    private client;

    constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    async createFollow(followData: FollowData): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerAliasAttr]: followData.follower.alias,
                [this.followerFirstNameAttr]: followData.follower.firstName,
                [this.followerLastNameAttr]: followData.follower.lastName,
                [this.followerImageUrlAttr]: followData.follower.imageUrl,
                [this.followeeAliasAttr]: followData.followee.alias,
                [this.followeeFirstNameAttr]: followData.followee.firstName,
                [this.followeeLastNameAttr]: followData.followee.lastName,
                [this.followeeImageUrlAttr]: followData.followee.imageUrl
            }
        }
        await this.client.send(new PutCommand(params));
    }

    async deleteFollow(followData: FollowData): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerAliasAttr]: followData.follower.alias,
                [this.followeeAliasAttr]: followData.followee.alias,
            },
        };
        await this.client.send(new DeleteCommand(params));
    }

    async readFollow(followData: FollowData): Promise<FollowData | undefined> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerAliasAttr]: followData.follower.alias,
                [this.followeeAliasAttr]: followData.followee.alias,
            },
        };
        const output = await this.client.send(new GetCommand(params));
        return this.mapItemToFollow(output.Item);
    }

    async readBatchFollowers(userAlias: string, pageSize: number, lastFollowerAlias: string | null): Promise<DataPage<FollowData>> {
        const params = {
            KeyConditionExpression: this.followeeAliasAttr + " = :followeeAlias",
            ExpressionAttributeValues: {
                ":followeeAlias": userAlias,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowerAlias === undefined
                    ? undefined
                    : {
                        [this.followeeAliasAttr]: userAlias,
                        [this.followerAliasAttr]: lastFollowerAlias,
                    },
        }

        const items: FollowData[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                this.mapItemToFollow(item)
            )
        );
        return new DataPage<FollowData>(items, hasMorePages);
    }

    async readBatchFollowees(userAlias: string, pageSize: number, lastFolloweeAlias: string | null): Promise<DataPage<FollowData>> {
        const params = {
            KeyConditionExpression: this.followerAliasAttr + " = :followerAlias",
            ExpressionAttributeValues: {
                ":followerAlias": userAlias,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFolloweeAlias === undefined
                    ? undefined
                    : {
                        [this.followeeAliasAttr]: lastFolloweeAlias,
                        [this.followerAliasAttr]: userAlias,
                    },
        }

        const items: FollowData[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                this.mapItemToFollow(item)
            )
        );
        return new DataPage<FollowData>(items, hasMorePages);
    }

    private mapItemToFollow(item: any): FollowData {
        const follower = new User(
            item[this.followerFirstNameAttr],
            item[this.followerLastNameAttr],
            item[this.followerAliasAttr],
            item[this.followerImageUrlAttr]
        );

        const followee = new User(
            item[this.followeeFirstNameAttr],
            item[this.followeeLastNameAttr],
            item[this.followeeAliasAttr],
            item[this.followeeImageUrlAttr]
        );

        return new FollowData(follower, followee);
    }
}

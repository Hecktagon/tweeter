import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import { AuthData } from "../../domain/AuthData";
import { AuthDAO } from "../interfaces/AuthDAO";

export class DynamoAuth implements AuthDAO {
    private tableName = "auth";
    private tokenAttr = "token";
    private timeStampAttr = "timestamp";
    private aliasAttr = "alias";
    private client;

    constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    async createAuth(authToken: AuthToken, userHandle: string): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                    [this.tokenAttr]: authToken.token,
                    [this.timeStampAttr]: authToken.timestamp,
                    [this.aliasAttr]: userHandle,
                },
            })
        );
    }

    async readAuth(token: string): Promise<AuthData | null> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { [this.tokenAttr]: token },
            })
        );

        if (!result.Item) return null;

        const authToken = new AuthToken(result.Item[this.tokenAttr], result.Item[this.timeStampAttr]);

        return new AuthData(authToken, result.Item[this.aliasAttr]);
    }

    async deleteAuth(token: string): Promise<void> {
        await this.client.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: { [this.tokenAttr]: token },
            })
        );
    }

    async updateAuthTimestamp(token: string, timestamp: number): Promise<void> {
        const authData = await this.readAuth(token);
        if (!authData) return;
        await this.createAuth(new AuthToken(token, timestamp), authData.userAlias);
    }
}
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDAO } from "../interfaces/UserDAO";
import { UserData } from "../../domain/UserData";

export class DynamoUser implements UserDAO {
    private tableName = "users";
    private aliasAttr = "alias";
    private firstNameAttr = "first_name";
    private lastNameAttr = "last_name";
    private imageUrlAttr = "image_url";

    constructor(private client: DynamoDBDocumentClient) {}

    async readUser(alias: string): Promise<UserData | undefined> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { [this.aliasAttr]: alias },
            })
        );

        return result.Item as UserData | undefined;
    }

    async createUser(userData: UserData): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                    [this.aliasAttr]: userData.user.alias,
                    [this.firstNameAttr]: userData.user.firstName,
                    [this.lastNameAttr]: userData.user.lastName,
                    [this.imageUrlAttr]: userData.user.imageUrl,
                }
            })
        );
    }

    async updateUser(userData: UserData): Promise<void> {
        await this.createUser(userData); // overwrite
    }
}
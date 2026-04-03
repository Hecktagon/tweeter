import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDAO } from "../interfaces/UserDAO";
import { UserData } from "../../domain/UserData";
import { User } from "tweeter-shared";

export class DynamoUser implements UserDAO {
    private tableName = "users";
    private aliasAttr = "alias";
    private firstNameAttr = "first_name";
    private lastNameAttr = "last_name";
    private imageUrlAttr = "image_url";
    private passwordAttr = "password";
    private followerCountAttr = "follower_count";
    private followingCountAttr = "following_count";

    constructor(private client: DynamoDBDocumentClient) { }

    async readUser(alias: string): Promise<UserData | undefined> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { [this.aliasAttr]: alias },
            })
        );

        if (!result.Item) {
            return undefined;
        }

        const item = result.Item;

        return new UserData( new User(
            item[this.firstNameAttr],
            item[this.lastNameAttr],
            item[this.aliasAttr],
            item[this.imageUrlAttr]
        ), 
            item[this.passwordAttr], 
            item[this.followerCountAttr], 
            item[this.followingCountAttr]);
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
                    [this.passwordAttr]: userData.password,
                    [this.followerCountAttr]: userData.n_followers,
                    [this.followingCountAttr]: userData.n_followees
                }
            })
        );
    }

    async updateUser(userData: UserData): Promise<void> {
        await this.createUser(userData); // overwrite
    }
}
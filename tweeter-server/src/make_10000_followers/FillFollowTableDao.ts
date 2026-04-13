import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";

export class FillFollowTableDao {
  //
  // Modify these values as needed to match your follow table.
  //
  private readonly tableName = "follows";
  private readonly followerAliasAttribute = "follower_alias";
  private readonly followeeAliasAttribute = "followee_alias";
  private readonly followerFirstNameAttribute = "follower_firstname";
  private readonly followerLastNameAttribute = "follower_lastname";
  private readonly followerImageUrlAttribute = "follower_imageurl";
  private readonly followeeFirstNameAttribute = "followee_firstname";
  private readonly followeeLastNameAttribute = "followee_lastname";
  private readonly followeeImageUrlAttribute = "followee_imageurl";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createFollows(followee: User, followerList: User[]) {
    if (followerList.length == 0) {
      console.log("Zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createPutFollowRequestItems(followee, followerList),
        },
      };

      try {
        const response = await this.client.send(new BatchWriteCommand(params));
        await this.putUnprocessedItems(response, params);
      } catch (err) {
        throw new Error(`Error while batch writing follows with params: ${params} \n${err}`);
      }
    }
  }

  private createPutFollowRequestItems(followee: User, followerList: User[]) {
    return followerList.map((follower) =>
      this.createPutFollowRequest(follower, followee)
    );
  }

  private createPutFollowRequest(follower: User, followee: User) {
    const item = {
      [this.followerAliasAttribute]: follower.alias,
      [this.followerFirstNameAttribute]: follower.firstName,
      [this.followerLastNameAttribute]: follower.lastName,
      [this.followerImageUrlAttribute]: follower.imageUrl,
      [this.followeeAliasAttribute]: followee.alias,
      [this.followeeFirstNameAttribute]: followee.firstName,
      [this.followeeLastNameAttribute]: followee.lastName,
      [this.followeeImageUrlAttribute]: followee.imageUrl,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }
  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length
        } unprocessed follow items.`,
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
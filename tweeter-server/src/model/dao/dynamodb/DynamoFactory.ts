import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AuthDAO } from "../interfaces/AuthDAO";
import { DAOFactory } from "../interfaces/DAOFactory";
import { FeedDAO } from "../interfaces/FeedDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { ImageDAO } from "../interfaces/ImageDAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoAuth } from "./DynamoAuth";
import { DynamoFollow } from "./DynamoFollow";
import { DynamoImage } from "./DynamoImage";
import { DynamoUser } from "./DynamoUser";
import { DynamoFeed } from "./DynamoFeed";
import { DynamoStatus } from "./DynamoStatus";

export class DynamoFactory implements DAOFactory {
    private static client: DynamoDBDocumentClient;

    private static getClient(): DynamoDBDocumentClient {
        if (!DynamoFactory.client) {
            DynamoFactory.client = DynamoDBDocumentClient.from(
                new DynamoDBClient({ region: "us-west-2" })
            );
        }
        return DynamoFactory.client;
    }

    userDAO(): UserDAO {
        return new DynamoUser(DynamoFactory.getClient());
    }

    statusDAO(): StatusDAO {
        return new DynamoStatus(DynamoFactory.getClient());
    }

    followDAO(): FollowDAO {
        return new DynamoFollow(DynamoFactory.getClient());
    }

    feedDAO(): FeedDAO {
        return new DynamoFeed(DynamoFactory.getClient());
    }

    authDAO(): AuthDAO {
        return new DynamoAuth(DynamoFactory.getClient());
    }

    imageDAO(): ImageDAO {
        return new DynamoImage();
    }
}
import { Status, User } from "tweeter-shared";
import { DataPage } from "../../domain/DataPage";

export interface FeedDAO {
    updateFollowerFeeds(followerAliases: string[], status: Status): Promise<void>;
    readBatchFeedItems(alias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>>;
}
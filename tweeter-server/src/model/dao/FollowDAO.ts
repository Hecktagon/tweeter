import { User } from "tweeter-shared";
import { DataPage } from "../domain/DataPage";
import { FollowData } from "../domain/FollowData";

export interface FollowDAO {
    createFollow(followData: FollowData): Promise<void>;
    deleteFollow(followData: FollowData): Promise<void>;
    readFollow(followData: FollowData): Promise<FollowData | undefined>;
    readBatchFollowers(userHandle: string, pageSize: number, lastFollowerAlias: string | null): Promise<DataPage<FollowData>>;
    readBatchFollowees(userHandle: string, pageSize: number, lastFolloweeAlias: string | null): Promise<DataPage<FollowData>>;
    updateFollow(followData: FollowData): Promise<void>;
}
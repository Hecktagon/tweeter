import { User } from "tweeter-shared";
import { DataPage } from "../../domain/DataPage";
import { FollowData } from "../../domain/FollowData";

export interface FollowDAO {
    createFollow(followData: FollowData): Promise<void>;
    deleteFollow(followData: FollowData): Promise<void>;
    readFollow(followData: FollowData): Promise<FollowData | undefined>;
    readBatchFollowers(userAlias: string, pageSize: number, lastFollowerAlias: string | null): Promise<DataPage<FollowData>>;
    readBatchFollowees(userAlias: string, pageSize: number, lastFolloweeAlias: string | null): Promise<DataPage<FollowData>>;
}
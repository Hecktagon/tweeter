import { DataPage } from "../domain/DataPage";
import { FollowData } from "../domain/FollowData";

export interface FollowDAO {
    createFollow(followerHandle: string, followeeHandle: string): Promise<void>;
    deleteFollow(followerHandle: string, followeeHandle: string): Promise<void>;
    readFollowers(userHandle: string): Promise<DataPage<FollowData>>;
    readFollowees(userHandle: string): Promise<DataPage<FollowData>>;
    updateFollow(followerHandle: string, followeeHandle: string): Promise<void>;
}
export interface FollowDAO {
    createFollow(followerHandle: string, followeeHandle: string): Promise<void>;
    deleteFollow(followerHandle: string, followeeHandle: string): Promise<void>;
    readFollowers(userHandle: string, limit: number, lastFollowerHandle?: string): Promise<string[]>;
    readFollowing(userHandle: string, limit: number, lastFolloweeHandle?: string): Promise<string[]>;
    updateFollow(followerHandle: string, followeeHandle: string): Promise<void>;
}
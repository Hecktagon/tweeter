export class FollowData {
    public followerAlias: string;
    public followeeAlias: string;

    public constructor(followerAlias: string, followeeAlias: string, followerName: string | undefined, followeeName: string | undefined) {
        this.followerAlias = followerAlias
        this.followeeAlias = followeeAlias
    }
}
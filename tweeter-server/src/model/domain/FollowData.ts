import { User } from "tweeter-shared";

export class FollowData {
    public follower: User;
    public followee: User;

    constructor(follower: User, followee: User) {
        this.follower = follower;
        this.followee = followee;
    }
}
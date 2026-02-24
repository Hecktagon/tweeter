import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";


export interface UserInfoView extends MessageView {
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    setFolloweeCount: (value: React.SetStateAction<number>) => void
    setFollowerCount: (value: React.SetStateAction<number>) => void
    navigate: NavigateFunction
    setDisplayedUser: (user: User) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService = new FollowService()

    public constructor(view: UserInfoView) {
        super(view)
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        }, "determine follower status")
    };

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count")
    };

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        }, "get followers count")
    };

    public switchToLoggedInUser(currentUser: User): void {
        this.view.setDisplayedUser(currentUser!);
        this.view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
    };

    public getBaseUrl(): string {
        const segments = location.pathname.split("/@");
        return segments.length > 1 ? segments[0] : "/";
    };

    public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        var followingUserToast = "";
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            followingUserToast = this.view.displayInfoMessage(
                `Following ${displayedUser!.name}...`,
                0
            );

            const [followerCount, followeeCount] = await this.followService.follow(
                authToken!,
                displayedUser!
            );

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, "follow user")
        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
    };

    public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        var unfollowingUserToast = "";
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            unfollowingUserToast = this.view.displayInfoMessage(
                `Unfollowing ${displayedUser!.name}...`,
                0
            );

            const [followerCount, followeeCount] = await this.followService.unfollow(
                authToken!,
                displayedUser!
            );

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, "unfollow user")
        this.view.deleteMessage(unfollowingUserToast);
        this.view.setIsLoading(false);
    };
}
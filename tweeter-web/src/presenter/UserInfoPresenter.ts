import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";


export interface UserInfoView {
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string;
    setFolloweeCount: (value: React.SetStateAction<number>) => void
    setFollowerCount: (value: React.SetStateAction<number>) => void
    navigate: NavigateFunction
    setDisplayedUser: (user: User) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    deleteMessage: (messageId: string) => void
}

export class UserInfoPresenter {
    private followService: FollowService
    private _view: UserInfoView

    public constructor(view: UserInfoView) {
        this.followService = new FollowService
        this._view = view
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this._view.setIsFollower(false);
            } else {
                this._view.setIsFollower(
                    await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`,
            );
        }
    };

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this._view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`,
            );
        }
    };

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this._view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`,
            );
        }
    };

    public switchToLoggedInUser(currentUser: User): void {
        this._view.setDisplayedUser(currentUser!);
        this._view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
    };

    public getBaseUrl(): string {
        const segments = location.pathname.split("/@");
        return segments.length > 1 ? segments[0] : "/";
    };

    public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        var followingUserToast = "";

        try {
            this._view.setIsLoading(true);
            followingUserToast = this._view.displayInfoMessage(
                `Following ${displayedUser!.name}...`,
                0
            );

            const [followerCount, followeeCount] = await this.followService.follow(
                authToken!,
                displayedUser!
            );

            this._view.setIsFollower(true);
            this._view.setFollowerCount(followerCount);
            this._view.setFolloweeCount(followeeCount);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`,
            );
        } finally {
            this._view.deleteMessage(followingUserToast);
            this._view.setIsLoading(false);
        }
    };

    public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        var unfollowingUserToast = "";

        try {
            this._view.setIsLoading(true);
            unfollowingUserToast = this._view.displayInfoMessage(
                `Unfollowing ${displayedUser!.name}...`,
                0
            );

            const [followerCount, followeeCount] = await this.followService.unfollow(
                authToken!,
                displayedUser!
            );

            this._view.setIsFollower(false);
            this._view.setFollowerCount(followerCount);
            this._view.setFolloweeCount(followeeCount);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`,
            );
        } finally {
            this._view.deleteMessage(unfollowingUserToast);
            this._view.setIsLoading(false);
        }
    };
}
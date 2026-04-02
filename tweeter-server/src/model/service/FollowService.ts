import { User, UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { AuthDAO } from "../dao/AuthDAO";
import { FollowData } from "../domain/FollowData";
import { UserData } from "../domain/UserData";

export class FollowService {
    private _followDao: FollowDAO;
    private _authDao: AuthDAO;
    private _userDao: UserDAO;

    public constructor(daoFactory: DAOFactory) {
        this._followDao = daoFactory.followDAO();
        this._authDao = daoFactory.authDAO();
        this._userDao = daoFactory.userDAO();
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {

        const followsDataPage = await this._followDao.readBatchFollowers(userAlias, pageSize, lastItem ? lastItem.alias : null);

        const dtos = followsDataPage.values.map((f: FollowData) => f.follower.dto);

        return [dtos, followsDataPage.hasMorePages];
    };

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {

        const followsDataPage = await this._followDao.readBatchFollowees(userAlias, pageSize, lastItem ? lastItem.alias : null);

        const dtos = followsDataPage.values.map((f: FollowData) => f.followee.dto);

        return [dtos, followsDataPage.hasMorePages];
    };

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        const followData = await this._followDao.readFollow(new FollowData(User.fromDto(user)!, User.fromDto(selectedUser)!));
        return followData !== undefined;
    };

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        const userData = await this._userDao.readUser(user.alias)
        if (!userData) {
            throw new Error("bad-request: user not found");
        }
        return userData.n_followees;
    };

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        const userData = await this._userDao.readUser(user.alias)
        if (!userData) {
            throw new Error("bad-request: user not found");
        }
        return userData.n_followers;
    };

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {

        const authData = await this._authDao.readAuth(token);
        const userAlias = authData!.userAlias;

        const userData = await this._userDao.readUser(userAlias);
        if (!userData) {
            throw new Error("bad-request: user not found");
        }

        const userDataToFollow = await this._userDao.readUser(userToFollow.alias);
        if (!userDataToFollow) {
            throw new Error("bad-request: user to follow not found");
        }

        const newFollowData = new FollowData(userData.user, userDataToFollow.user);

        const existingFollowData = await this._followDao.readFollow(newFollowData);
        if (existingFollowData) {
            throw new Error("bad-request: already following user");
        }

        await this._followDao.createFollow(newFollowData);
        await this._userDao.updateUser(new UserData(userData.user, userData.password, userData.n_followers, userData.n_followees + 1));
        await this._userDao.updateUser(new UserData(userDataToFollow.user, userDataToFollow.password, userDataToFollow.n_followers + 1, userDataToFollow.n_followees));

        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];  // TODO: I'm not sure if this is supposed to return the count for the follower or followee. Right now its assuming followee.
    };

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const authData = await this._authDao.readAuth(token);
        const userAlias = authData!.userAlias;

        const userData = await this._userDao.readUser(userAlias);
        if (!userData) {
            throw new Error("bad-request: user not found");
        }

        const userDataToUnfollow = await this._userDao.readUser(userToUnfollow.alias);
        if (!userDataToUnfollow) {
            throw new Error("bad-request: user to follow not found");
        }

        const existingFollowData = await this._followDao.readFollow(new FollowData(userData.user, userDataToUnfollow.user));
        if (!existingFollowData) {
            throw new Error("bad-request: not following user");
        }

        await this._followDao.deleteFollow(existingFollowData);
        await this._userDao.updateUser(new UserData(userData.user, userData.password, userData.n_followers, userData.n_followees - 1));
        await this._userDao.updateUser(new UserData(userDataToUnfollow.user, userDataToUnfollow.password, userDataToUnfollow.n_followers - 1, userDataToUnfollow.n_followees));

        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
    };

    // private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    //     const [items, hasMore] =  FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    //     const dtos : UserDto[] = items.map((user) =>user.dto);
    //     return [dtos, hasMore];
    // }
}
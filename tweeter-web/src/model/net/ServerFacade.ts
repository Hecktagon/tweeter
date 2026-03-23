import {
    FollowActionRequest, FollowActionResponse,
    FollowerStatusRequest, FollowerStatusResponse,
    GetFollowCountRequest, GetFollowCountResponse,
    GetUserRequest, GetUserResponse,
    LoginRequest, LoginResponse,
    LogoutRequest, LogoutResponse,
    PagedStatusRequest, PagedStatusResponse,
    PagedUserItemRequest, PagedUserItemResponse,
    PostStatusRequest, PostStatusResponse,
    RegisterRequest, RegisterResponse,
    User, Status, AuthToken
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL = "http://localhost:8080"; // or your actual server

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async follow(request: FollowActionRequest): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            FollowActionResponse
        >(request, "/follow");

        if (response.success) {
            return [response.followerCount, response.followeeCount];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async unfollow(request: FollowActionRequest): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            FollowActionResponse
        >(request, "/unfollow");

        if (response.success) {
            return [response.followerCount, response.followeeCount];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getMoreFollowees(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/followee/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors
        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/follower/list");

        const items =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        if (response.success) {
            if (!items) throw new Error("No followers found");
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getFollowerCount(request: GetFollowCountRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            GetFollowCountRequest,
            GetFollowCountResponse
        >(request, "/follower/count");

        if (response.success) {
            return response.count;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getFolloweeCount(request: GetFollowCountRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            GetFollowCountRequest,
            GetFollowCountResponse
        >(request, "/followee/count");

        if (response.success) {
            return response.count;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getFollowerStatus(request: FollowerStatusRequest): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<
            FollowerStatusRequest,
            FollowerStatusResponse
        >(request, "/follower/status");

        if (response.success) {
            return response.isFollowing;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getMoreFeedItems(request: PagedStatusRequest): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusRequest,
            PagedStatusResponse
        >(request, "/feed/list");

        const items =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        if (response.success) {
            if (!items) throw new Error("No feed items found");
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getMoreStoryItems(request: PagedStatusRequest): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusRequest,
            PagedStatusResponse
        >(request, "/story/list");

        const items =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        if (response.success) {
            if (!items) throw new Error("No story items found");
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async postStatus(request: PostStatusRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            PostStatusRequest,
            PostStatusResponse
        >(request, "/status/post");

        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async getUser(request: GetUserRequest): Promise<User | null> {
        const response = await this.clientCommunicator.doPost<
            GetUserRequest,
            GetUserResponse
        >(request, "/user/get");

        const user =
            response.success && response.user
                ? User.fromDto(response.user)
                : null;

        if (response.success) {
            return user;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async login(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            LoginRequest,
            LoginResponse
        >(request, "/login");

        if (response.success && response.user && response.auth) {
            const user = User.fromDto(response.user);
            const auth = AuthToken.fromDto(response.auth);

            if (!user || !auth) {
                throw new Error("Invalid response from server");
            }

            return [user, auth];
        } else {
            console.error(response);
            throw new Error(response.message ?? "Login failed");
        }
    }

    async logout(request: LogoutRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            LogoutRequest,
            LogoutResponse
        >(request, "/logout");

        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    async register(request: RegisterRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            RegisterRequest,
            RegisterResponse
        >(request, "/register");

        if (response.success && response.user && response.auth) {
            const user = User.fromDto(response.user);
            const auth = AuthToken.fromDto(response.auth);

            if (!user || !auth) {
                throw new Error("Invalid response from server");
            }

            return [user, auth];
        } else {
            console.error(response);
            throw new Error(response.message ?? "Registration failed");
        }
    }
}
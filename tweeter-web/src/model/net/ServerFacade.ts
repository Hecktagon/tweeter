import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";

export class ServerFacade{
    follow(request: FollowActionRequest): Promise<FollowActionResponse> {

    }

    unfollow(request: FollowActionRequest): Promise<FollowActionResponse> {

    }

    getFollowers(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {

    }

    getFollowees(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {

    }

    getFollowerCount(request: GetFollowCountRequest): Promise<GetFollowCountResponse> {

    }

    getFolloweeCount(request: GetFollowCountRequest): Promise<GetFollowCountResponse> {

    }

    getFollowerStatus(request: FollowerStatusRequest): Promise<FollowerStatusResponse> {

    }

    getFeedItems(request: PagedStatusRequest): Promise<PagedStatusResponse> {

    }

    getStoryItems(request: PagedStatusRequest): Promise<PagedStatusResponse> {

    }

    postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {

    }

    getUser(request: GetUserRequest): Promise<GetUserResponse> {

    }

    login(request: LoginRequest): Promise<LoginResponse> {

    }

    logout(request: LogoutRequest): Promise<LogoutResponse> {

    }

    register(request: RegisterRequest): Promise<RegisterResponse> {

    }
}
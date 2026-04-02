import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthService } from "../../model/service/AuthService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
    const followService = new FollowService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);
    const [followerCount, followeeCount] = await followService.follow(request.token, request.targetUser);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}
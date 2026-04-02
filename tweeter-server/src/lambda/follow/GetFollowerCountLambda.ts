import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthService } from "../../model/service/AuthService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (request: GetFollowCountRequest): Promise<GetFollowCountResponse> => {
    const followService = new FollowService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);
    const count = await followService.getFollowerCount(request.token, request.user);

    return {
        success: true,
        message: null,
        count: count
    }
}
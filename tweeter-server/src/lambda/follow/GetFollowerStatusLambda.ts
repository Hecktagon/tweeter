import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthService } from "../../model/service/AuthService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
    const followService = new FollowService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);
    const isFollowing = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: null,
        isFollowing: isFollowing
    }
}
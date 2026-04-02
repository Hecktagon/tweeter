import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AuthService } from "../../model/service/AuthService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (
    request: PostStatusRequest
): Promise<PostStatusResponse> => {

    const service = new StatusService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);

    await service.postStatus(
        request.token,
        request.newStatus
    );

    return {
        success: true,
        message: null
    };
};
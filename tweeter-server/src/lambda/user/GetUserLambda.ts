import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthService } from "../../model/service/AuthService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (
    request: GetUserRequest
): Promise<GetUserResponse> => {

    const service = new UserService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);

    const user = await service.getUser(
        request.token,
        request.alias
    );

    return {
        success: true,
        message: null,
        user: user
    };
};
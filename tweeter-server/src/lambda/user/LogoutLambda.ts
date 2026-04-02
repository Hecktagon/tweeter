import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
    request: LogoutRequest
): Promise<LogoutResponse> => {

    const service = new UserService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);

    await service.logout(request.token);

    return {
        success: true,
        message: null
    };
};
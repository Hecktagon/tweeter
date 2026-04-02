import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (
    request: LoginRequest
): Promise<LoginResponse> => {

    const service = new UserService(DAOFactoryConfig.getDAOFactory());

    const [user, auth] = await service.login(
        request.alias,
        request.password
    );

    return {
        success: true,
        message: null,
        user: user,
        auth: auth
    };
};
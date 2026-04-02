import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (
    request: RegisterRequest
): Promise<RegisterResponse> => {

    const service = new UserService(DAOFactoryConfig.getDAOFactory());

    const [user, auth] = await service.register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        request.userImageString,
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: user,
        auth: auth
    };
};
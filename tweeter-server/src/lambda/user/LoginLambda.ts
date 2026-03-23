import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
    request: LoginRequest
): Promise<LoginResponse> => {

    const service = new UserService();

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
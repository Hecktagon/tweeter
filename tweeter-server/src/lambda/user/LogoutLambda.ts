import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
    request: LogoutRequest
): Promise<LogoutResponse> => {

    const service = new UserService();

    await service.logout(request.token);

    return {
        success: true,
        message: null
    };
};
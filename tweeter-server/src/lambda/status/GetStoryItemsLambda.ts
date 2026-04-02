import { PagedStatusRequest, PagedStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AuthService } from "../../model/service/AuthService";
import { DAOFactoryConfig } from "../../config/DAOFactoryConfig";

export const handler = async (
    request: PagedStatusRequest
): Promise<PagedStatusResponse> => {

    const service = new StatusService(DAOFactoryConfig.getDAOFactory());
    const authService = new AuthService(DAOFactoryConfig.getDAOFactory());
    await authService.verifyAuth(request.token);

    const [items, hasMore] = await service.loadMoreStoryItems(
        request.token,
        request.userAlias,
        request.pageSize,
        request.lastItem
    );

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    };
};
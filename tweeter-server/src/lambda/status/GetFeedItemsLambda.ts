import { PagedStatusRequest, PagedStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
    request: PagedStatusRequest
): Promise<PagedStatusResponse> => {

    const service = new StatusService();

    const [items, hasMore] = await service.loadMoreFeedItems(
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
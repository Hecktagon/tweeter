import { Status } from "tweeter-shared";
import { DAOFactoryConfig } from "../../../config/DAOFactoryConfig";
import { StatusService } from "../../../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
    const statusService = new StatusService(DAOFactoryConfig.getDAOFactory());
    for (const record of event.Records) {
        const parsed = JSON.parse(record.body);
        const status = Status.fromJson(parsed.status);
        const pageFollowerAliases = parsed.aliases;

        if (status === null) {
            throw Error("bad-request: failed to parse status from message body");
        }

        await statusService.sqsBatchUpdateFeeds(status, pageFollowerAliases);
    }
};
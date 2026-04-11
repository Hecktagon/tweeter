import { Status } from "tweeter-shared";
import { StatusService } from "../../../model/service/StatusService";
import { DAOFactoryConfig } from "../../../config/DAOFactoryConfig";

export const handler = async (event: any): Promise<void> => {
    const statusService = new StatusService(DAOFactoryConfig.getDAOFactory());
    for (const record of event.Records) {
        const parsed = JSON.parse(record.body);
        const status = Status.fromJson(parsed.status);

        if (status === null) {
            throw Error("bad-request: failed to parse status from message body");
        }

        await statusService.sqsBatchFollowers(status);
    }
};
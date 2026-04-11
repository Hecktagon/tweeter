import { Status } from "tweeter-shared";
import { StatusService } from "../../../model/service/StatusService";
import { DAOFactoryConfig } from "../../../config/DAOFactoryConfig";

export const handler = async (event: any): Promise<void> => {
    const statusService = new StatusService(DAOFactoryConfig.getDAOFactory());
    for (const record of event.Records) {
        const status = Status.fromJson(record.body);

        if (status === null) {
            throw Error("bad-request: failed to parse status from message body");
            continue;
        }

        await statusService.sqsBatchFollowers(status);
    }
};
import { Status } from "tweeter-shared";
import { DataPage } from "../../domain/DataPage";

export interface StatusDAO {
    createStatus(status: Status): Promise<void>;
    readBatchStatuses(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>>;
    deleteStatus(status: Status): Promise<void>;
}
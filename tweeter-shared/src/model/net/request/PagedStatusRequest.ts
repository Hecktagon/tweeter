import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusRequest {
    readonly token: string;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: StatusDto | null;
}
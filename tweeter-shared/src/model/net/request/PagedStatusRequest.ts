import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedStatusRequest extends TweeterRequest{
    readonly token: string;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: StatusDto | null;
}
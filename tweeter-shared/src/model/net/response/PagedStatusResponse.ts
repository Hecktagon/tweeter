import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";


export interface PagedStatusResponse extends TweeterResponse {
    readonly items: StatusDto[];
    readonly hasMore: boolean;
}
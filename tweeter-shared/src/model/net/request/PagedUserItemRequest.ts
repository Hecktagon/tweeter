import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemRequest {
    readonly token: string; 
    readonly userAlias: string;
    readonly pageSize: number;
    readonly user: UserDto | null;
}
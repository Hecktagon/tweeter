import { UserDto } from "../../dto/UserDto";

export interface FollowerStatusRequest {
    readonly token: string; 
    readonly user: UserDto; 
    readonly selectedUser: UserDto;
}
import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";
import { AuthDto } from "../../dto/AuthDto";

export interface LoginResponse extends TweeterResponse {
    readonly user: UserDto;
    readonly auth: AuthDto;
}
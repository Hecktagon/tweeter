import { UserDto } from "../../dto/UserDto"
import { TweeterRequest } from "./TweeterRequest"

export interface GetFollowCountRequest extends TweeterRequest{
    token: string
    user: UserDto
}
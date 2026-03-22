import { UserDto } from "../../dto/UserDto"

export interface FollowActionRequest {
    token: string
    targetUser: UserDto
}
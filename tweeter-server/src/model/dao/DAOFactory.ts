import { AuthDAO } from "./AuthDAO"
import { FeedDAO } from "./FeedDAO"
import { FollowDAO } from "./FollowDAO"
import { ImageDAO } from "./ImageDAO"
import { StatusDAO } from "./StatusDAO"
import { UserDAO } from "./UserDAO"

export interface DAOFactory {
    userDAO(): UserDAO
    statusDAO(): StatusDAO
    followDAO(): FollowDAO
    feedDAO(): FeedDAO
    authDAO(): AuthDAO
    imageDAO(): ImageDAO
}
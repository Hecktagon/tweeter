import { User } from "tweeter-shared";
import { UserData } from "../domain/UserData";

export interface UserDAO{
    readUser(alias: string): Promise<UserData | null>;
    createUser(user: User, hashedPassword: string, n_followers: number, n_followees: number): Promise<void>;
}
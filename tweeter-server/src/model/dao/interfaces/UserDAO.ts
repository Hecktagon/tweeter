import { User } from "tweeter-shared";
import { UserData } from "../../domain/UserData";

export interface UserDAO{
    readUser(alias: string): Promise<UserData | undefined>;
    createUser(userData: UserData): Promise<void>;
    updateUser(userData: UserData): Promise<void>;
}
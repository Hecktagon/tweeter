import { User } from "tweeter-shared";

export interface UserDAO{
    readUser(alias: string): Promise<{ user: User; password: string } | null>;
    createUser(user: User, hashedPassword: string, n_followers: number, n_followees: number): Promise<void>;
}
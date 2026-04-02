import { User } from "tweeter-shared";

export class UserData {
    public user: User;
    public password: string;
    public n_followers: number;
    public n_followees: number;

    constructor(user: User, password: string, n_followers: number, n_followees: number) {
        this.user = user;
        this.password = password;
        this.n_followers = n_followers;
        this.n_followees = n_followees;
    }
}
    
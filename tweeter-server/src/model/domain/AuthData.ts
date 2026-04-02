import { AuthToken } from "tweeter-shared";

export class AuthData {
    public authToken: AuthToken;
    public userAlias: string;

    constructor(authToken: AuthToken, userAlias: string) {
        this.authToken = authToken;
        this.userAlias = userAlias;
    }
}
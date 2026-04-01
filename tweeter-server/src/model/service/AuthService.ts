import { AuthToken } from "tweeter-shared";

export class AuthService {
    verifyAuth(token: string): Promise<{ authToken: AuthToken; userHandle: string } | null> {
        throw new Error("Method not implemented.");
    }
}
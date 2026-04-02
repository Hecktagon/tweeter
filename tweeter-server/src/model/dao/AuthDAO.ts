import { AuthToken } from "tweeter-shared";


export interface AuthDAO {
    createAuth(authToken: AuthToken, userHandle: string): Promise<void>;
    readAuth(token: string): Promise<{ authToken: AuthToken; userHandle: string } | null>;
    deleteAuth(token: string): Promise<void>;
    updateAuth(authToken: AuthToken): Promise<void>;
}
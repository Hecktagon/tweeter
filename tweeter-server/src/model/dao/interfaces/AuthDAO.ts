import { AuthToken } from "tweeter-shared";
import { AuthData } from "../../domain/AuthData";


export interface AuthDAO {
    createAuth(authToken: AuthToken, userHandle: string): Promise<void>;
    readAuth(token: string): Promise<AuthData | null>;
    deleteAuth(token: string): Promise<void>;
}
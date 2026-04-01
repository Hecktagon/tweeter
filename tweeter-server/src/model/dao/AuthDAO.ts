import { AuthToken } from "tweeter-shared";


export interface AuthDAO {
    createAuth(token: string, timestamp: number, userHandle: string): Promise<void>;
    readAuth(token: string): Promise<{ authToken: AuthToken; userHandle: string } | null>;
    deleteAuth(token: string): Promise<void>;
    updateAuth(token: string, timestamp: number): Promise<void>;
}
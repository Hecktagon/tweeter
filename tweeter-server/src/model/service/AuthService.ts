import { AuthDAO } from "../dao/interfaces/AuthDAO";
import { DAOFactory } from "../dao/interfaces/DAOFactory";

export class AuthService {
    private _authDao: AuthDAO;

    public constructor(daoFactory: DAOFactory) {
        this._authDao = daoFactory.authDAO();
    }

    async verifyAuth(token: string): Promise<void> {
        const authObject = await this._authDao.readAuth(token);
        if (authObject === null || authObject.authToken === null || authObject.userAlias === null) {
             throw new Error("unauthorized");
        }
    }
}
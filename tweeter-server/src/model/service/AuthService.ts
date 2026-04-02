import { AuthDAO } from "../dao/AuthDAO";
import { DAOFactory } from "../dao/DAOFactory";

export class AuthService {
    private _authDao: AuthDAO;

    public constructor(daoFactory: DAOFactory) {
        this._authDao = daoFactory.authDAO();
    }

    async verifyAuth(token: string): Promise<void> {
        const authObject = await this._authDao.readAuth(token);
        if (authObject === null || authObject.authToken === null || authObject.userHandle === null) {
             throw new Error("unauthorized");
        }
    }
}
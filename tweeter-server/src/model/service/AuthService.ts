import { AuthDAO } from "../dao/interfaces/AuthDAO";
import { DAOFactory } from "../dao/interfaces/DAOFactory";

export class AuthService {
    private _authDao: AuthDAO;
    private static readonly MAX_INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes

    public constructor(daoFactory: DAOFactory) {
        this._authDao = daoFactory.authDAO();
    }

    async verifyAuth(token: string): Promise<void> {
        const authObject = await this._authDao.readAuth(token);
        if (!authObject || !authObject.authToken || !authObject.userAlias) {
            throw new Error("unauthorized");
        }

        const elapsed = Date.now() - authObject.authToken.timestamp;
        if (elapsed > AuthService.MAX_INACTIVITY_MS) {
            await this._authDao.deleteAuth(token);
            throw new Error("unauthorized: session expired");
        }

        // refresh timestamp on every verified request
        await this._authDao.updateAuthTimestamp(token, Date.now());
    }
}
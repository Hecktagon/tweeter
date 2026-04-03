import { AuthToken, AuthDto, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/interfaces/DAOFactory";
import { AuthDAO } from "../dao/interfaces/AuthDAO";
import { ImageDAO } from "../dao/interfaces/ImageDAO";
import { UserDAO } from "../dao/interfaces/UserDAO";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { UserData } from "../domain/UserData";

export class UserService implements Service {
    private _authDao: AuthDAO;
    private _userDao: UserDAO;
    private _imageDao: ImageDAO;

    public constructor(daoFactory: DAOFactory) {
        this._authDao = daoFactory.authDAO();
        this._userDao = daoFactory.userDAO();
        this._imageDao = daoFactory.imageDAO();
    }

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        const userObject = await this._userDao.readUser(alias);
        const user = userObject ? userObject.user : null;
        return user ? user.dto : null;
    }

    public async logout(token: string): Promise<void> {
        await this._authDao.deleteAuth(token);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthDto]> {
        if (!alias || !password) {
            throw new Error("bad-request: missing alias or password");
        }

        const userObject = await this._userDao.readUser(alias);
        const user = userObject ? userObject.user : null;
        if (!user || !userObject) {
            throw new Error("unauthorized: invalid alias or password");
        }

        const passwordMatches = await bcrypt.compare(password, userObject.password);
        if (!passwordMatches) {
            throw new Error("unauthorized: invalid alias or password");
        }

        const auth = new AuthToken(randomBytes(32).toString("hex"), Date.now());

        await this._authDao.createAuth(auth, alias);

        return [user.dto, auth.dto];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthDto]> {

        if (!firstName || !lastName || !alias || !password || !userImageBytes) {
            throw new Error("bad-request: missing required fields");
        }

        const takenUser = await this._userDao.readUser(alias);
        if (takenUser !== undefined) {
            throw new Error("bad-request: user already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const imageUrl = await this._imageDao.putImage(`${alias}.${imageFileExtension}`, userImageBytes);
        const user = new User(firstName, lastName, alias, imageUrl);
        await this._userDao.createUser(new UserData(user, hashed, 0, 0));

        const auth = new AuthToken(randomBytes(32).toString("hex"), Date.now());
        await this._authDao.createAuth(auth, alias);

        return [user.dto, auth.dto];
    }
}
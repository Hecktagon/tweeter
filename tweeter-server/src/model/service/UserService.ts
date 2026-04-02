import { Buffer } from "buffer";
import { AuthToken, AuthDto, User, UserDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthDAO } from "../dao/AuthDAO";
import { ImageDAO } from "../dao/ImageDAO";
import { UserDAO } from "../dao/UserDAO";

export class UserService implements Service {
    private _daoFactory: DAOFactory;
    private _authDao: AuthDAO;
    private _userDao: UserDAO;
    private _imageDao: ImageDAO;

    public constructor(daoFactory: DAOFactory) {
        this._daoFactory = daoFactory;
        this._authDao = daoFactory.authDAO();
        this._userDao = daoFactory.userDAO();
        this._imageDao = daoFactory.imageDAO();
    }

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        const user = this._userDao.readUser(alias);
        return user ? user.dto : null;
    }

    public async logout(token: string): Promise<void> {
        await new Promise((res) => setTimeout(res, 1000));
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthDto]> {
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthDto]> {

        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    }
}
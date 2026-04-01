import { Buffer } from "buffer";
import { AuthToken, AuthDto, User, UserDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";

export class UserService implements Service {
    private _daoFactory: DAOFactory;

    public constructor(daoFactory: DAOFactory) {
        this._daoFactory = daoFactory;
    }

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        const user = FakeData.instance.findUserByAlias(alias);
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
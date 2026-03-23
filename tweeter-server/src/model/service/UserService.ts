import { Buffer } from "buffer";
import { AuthToken, AuthDto, User, UserDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {

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
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[UserDto, AuthDto]> {

        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    }
}
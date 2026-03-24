import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service{
    private serverFacade = new ServerFacade();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.serverFacade.getUser({ token: authToken.token, alias: alias });
    };

    public async logout(authToken: AuthToken): Promise<void> {
       return this.serverFacade.logout({ token: authToken.token });
    };

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        return this.serverFacade.login({ alias: alias, password: password });
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        return this.serverFacade.register({ firstName: firstName, lastName: lastName, alias: alias, password: password, userImageString: imageStringBase64, imageFileExtension: imageFileExtension });
    };
}
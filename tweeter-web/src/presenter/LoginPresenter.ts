import { UserService } from "../model.service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView>{
    private userService: UserService = new UserService;

    public async doLogin(alias: string, password: string, rememberMe: boolean): Promise<void> {
        await this.doAuth(rememberMe, "log user in", async () => {
            return await this.userService.login(alias, password);
        })
    };
}
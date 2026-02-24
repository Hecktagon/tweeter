import { UserService } from "../model.service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView>{
    private userService: UserService = new UserService;

    public attemptLogin(key: string, alias: string, password: string, rememberMe: boolean): void {
        if (key == "Enter" && !this.checkSubmitButtonStatus(alias, password)) {
            this.doLogin(alias, password, rememberMe);
        }
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    };

    public async doLogin(alias: string, password: string, rememberMe: boolean) {
        this.doAuth(rememberMe, "log user in", async () => {
            return await this.userService.login(alias, password);
        })
    };
}
import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
    navigate: NavigateFunction
    displayErrorMessage: (message: string) => void
}

export class LoginPresenter {
    private userService: UserService;
    private _view: LoginView

    public constructor(view: LoginView) {
        this.userService = new UserService
        this._view = view
    }

    public attemptLogin(key: string, alias: string, password: string, rememberMe: boolean, originalUrl: string): void {
        if (key == "Enter" && !this.checkSubmitButtonStatus(alias, password)) {
            this.doLogin(alias, password, rememberMe, originalUrl);
        }
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    };

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
        try {
            this._view.setIsLoading(true);

            const [user, authToken] = await this.userService.login(alias, password);

            this._view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this._view.navigate(originalUrl);
            } else {
                this._view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this._view.setIsLoading(false);
        }
    };
}
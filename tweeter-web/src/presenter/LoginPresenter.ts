import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
    navigate: NavigateFunction
}

export class LoginPresenter extends Presenter<LoginView> {
    private userService: UserService = new UserService();

    public constructor(view: LoginView) {
        super(view)
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
            this.view.setIsLoading(true);

            await this.doFailureReportingOperation(async () => {

            const [user, authToken] = await this.userService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        }, "log user in")
        } finally {
            this.view.setIsLoading(false);
        }
    };
}
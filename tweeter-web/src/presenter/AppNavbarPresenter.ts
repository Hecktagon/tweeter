import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AppNavbarView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    deleteMessage: (messageId: string) => void
    clearUserInfo: () => void
    navigate: NavigateFunction
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private userService: UserService = new UserService();

    public constructor(view: AppNavbarView) {
        super(view)
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
        this.doFailureReportingOperation(async () => {
            await this.userService.logout(authToken!);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out")
    };
}
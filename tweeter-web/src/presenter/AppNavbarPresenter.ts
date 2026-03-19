import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter} from "./Presenter";

export interface AppNavbarView extends MessageView{
    clearUserInfo: () => void
    navigate: NavigateFunction
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private userService: UserService = new UserService();

    public constructor(view: AppNavbarView) {
        super(view)
    }

    public get service(){
        return this.userService
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
        await this.doFailureReportingOperation(async () => {
            await this.service.logout(authToken!);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out")
    };
}
import { NavigateFunction } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationHookView {
    setDisplayedUser: (user: User) => void
    navigate: NavigateFunction
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export class UserNavigationHookPresenter {
    private userService: UserService
    private _view: UserNavigationHookView

    public constructor(view: UserNavigationHookView) {
        this.userService = new UserService
        this._view = view
    }

    public async navigateToUser(eventTargetString: string, authToken: AuthToken, displayedUser: User, featurePath: string): Promise<void> {
        try {
            const alias = this.extractAlias(eventTargetString);

            const toUser = await this.userService.getUser(authToken!, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser!)) {
                    this._view.setDisplayedUser(toUser);
                    this._view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`,
            );
        }
    };

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}
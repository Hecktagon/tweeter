import { NavigateFunction } from "react-router-dom"
import { User, AuthToken } from "tweeter-shared"
import { Presenter, View } from "./Presenter"

export interface AuthView extends View {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
    navigate: NavigateFunction
}

export class AuthPresenter<T extends AuthView> extends Presenter<T> {
    public constructor(view: T) {
        super(view)
    }

    protected async doAuth(rememberMe: boolean, operationDescription: string, authenticate: () => Promise<[User, AuthToken]>) {
        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);

            const [user, authToken] = await authenticate();

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            this.view.navigate(`/feed/${user.alias}`);
        }, operationDescription, () => {
            this.view.setIsLoading(false);
        })
        
    }


}
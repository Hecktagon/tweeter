import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    deleteMessage: (messageId: string) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setPost: React.Dispatch<React.SetStateAction<string>>
    displayErrorMessage: (message: string) => void
}

export class PostStatusPresenter {
    private _view: PostStatusView;
    private statusService: StatusService;

    public constructor(view: PostStatusView) {
        this._view = view;
        this.statusService = new StatusService;
    }

    public async submitPost(post: string, authToken: AuthToken, currentUser: User) {
        var postingStatusToastId = "";

        try {
            this._view.setIsLoading(true);
            postingStatusToastId = this._view.displayInfoMessage(
                "Posting status...",
                0
            );

            const status = new Status(post, currentUser!, Date.now());

            await this.statusService.postStatus(authToken!, status);

            this._view.setPost("");
            this._view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`,
            );
        } finally {
            this._view.deleteMessage(postingStatusToastId);
            this._view.setIsLoading(false);
        }
    };

    public clearPost() {
        this._view.setPost("");
    };

    public checkButtonStatus(post: string, authToken: AuthToken, currentUser: User) {
        return !post.trim() || !authToken || !currentUser;
    };

}
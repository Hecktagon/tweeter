import { User } from "tweeter-shared"

export interface UserItemView {
    addItems: (items: User[]) => void
    displayErrorMessage: (message: string) => void
}

export class UserItemPresenter {
    private _view: UserItemView;
    private hasMoreItems = true;
    private lastItem: User | null = null;

    protected constructor(view: UserItemView) {
        this._view = view
    }

    protected get view() {
        return this._view
    }

    reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
    }
}

export interface View{
    displayErrorMessage: (message: string) => void
}

export interface MessageView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    deleteMessage: (messageId: string) => void
}

export abstract class Presenter<V extends View> {
    protected _view: V;

    protected constructor(view: V){
        this._view = view
    }

    protected get view() : V {
        return this._view;
    }

    public async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string) {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to load ${operationDescription} because of exception: ${error}`,
            );
        }
    };
}
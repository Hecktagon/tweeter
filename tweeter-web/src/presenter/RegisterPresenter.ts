import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
    setImageFileExtension: (value: React.SetStateAction<string>) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
    private userService: UserService = new UserService();

    public constructor(view: RegisterView) {
        super(view);
    }

    public attemptRegister(key: string, firstName: string, lastName: string, alias: string, password: string, imageUrl: string, imageFileExtension: string, imageBytes: Uint8Array, rememberMe: boolean): void {
        if (key == "Enter" && !this.checkSubmitButtonStatus(firstName, lastName, alias, password, imageUrl, imageFileExtension)) {
            this.doRegister(firstName, lastName, alias, password, imageFileExtension, imageBytes, rememberMe);
        }
    }

    public checkSubmitButtonStatus(firstName: string, lastName: string, alias: string, password: string, imageUrl: string, imageFileExtension: string): boolean {
        return (
            !firstName ||
            !lastName ||
            !alias ||
            !password ||
            !imageUrl ||
            !imageFileExtension
        );
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageFileExtension: string, imageBytes: Uint8Array, rememberMe: boolean) {
        await this.doAuth(rememberMe, "register user", async () => {
            return await this.userService.register(firstName, lastName, alias, password, imageBytes, imageFileExtension);
        })
    }

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");

                this.view.setImageBytes(bytes);
            };

            reader.readAsDataURL(file);

            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.view.setImageFileExtension(fileExtension);
            }
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    }

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    }
}
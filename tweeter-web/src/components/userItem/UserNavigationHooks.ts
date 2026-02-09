import { NavigateFunction } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";

interface useUserNavInputs {
    authToken: AuthToken | null;
    displayedUser: User | null;
    setDisplayedUser: (user: User) => void;
    navigate: NavigateFunction;
    featurePath: string;
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export const useUserNavigation = (props: useUserNavInputs) => {
    //TODO: move hooks into here.

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try {
            const alias = extractAlias(event.target.toString());

            const toUser = await getUser(props.authToken!, alias);

            if (toUser) {
                if (!toUser.equals(props.displayedUser!)) {
                    props.setDisplayedUser(toUser);
                    props.navigate(`${props.featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            props.displayErrorMessage(
                `Failed to get user because of exception: ${error}`,
            );
        }
    };

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    return{ navigateToUser };
}

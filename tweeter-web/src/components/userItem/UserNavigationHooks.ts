import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserNavigationHookPresenter, UserNavigationHookView } from "../../presenter/UserNavigationHookPresenter";
import { useRef } from "react";

interface useUserNavInputs {
    featurePath: string;
    presenterFactory: (view: UserNavigationHookView) => UserNavigationHookPresenter
}

export const useUserNavigation = (props: useUserNavInputs) => {
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();

    const listener: UserNavigationHookView = {
        setDisplayedUser: setDisplayedUser,
        navigate: navigate,
        displayErrorMessage: displayErrorMessage
    }

    const presenterRef = useRef<UserNavigationHookPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = props.presenterFactory(listener)
    }

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenterRef.current!.navigateToUser(event.target.toString(), authToken!, displayedUser!, props.featurePath)
    };

    return { navigateToUser };
}

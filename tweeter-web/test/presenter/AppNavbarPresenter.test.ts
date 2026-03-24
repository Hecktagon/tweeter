import { AuthToken } from "tweeter-shared"
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter" 
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { UserService } from "../../src/model/service/UserService"


describe("AppNavbarPresenter", () => {
    let mockNavbarView: AppNavbarView;
    let navbarPresenter: AppNavbarPresenter;

    let mockService: UserService;

    const authToken: AuthToken = new AuthToken("dummyAuth123", Date.now())

    beforeEach(() => {
        mockNavbarView = mock<AppNavbarView>();
        const mockNavbarViewInstance = instance(mockNavbarView)
        when(mockNavbarView.displayInfoMessage(anything(), anything())).thenReturn("testMessageID123")

        const navbarPresenterSpy = spy(new AppNavbarPresenter(mockNavbarViewInstance)) 
        navbarPresenter = instance(navbarPresenterSpy)

        mockService = mock<UserService>();

        when(navbarPresenterSpy.service).thenReturn(instance(mockService))
    })

    test("presenter tells view to display logging out message", async () => {
        await navbarPresenter.logOut(authToken)
        verify(mockNavbarView.displayInfoMessage("Logging Out...", 0)).once()
    })

    test("presenter calls logout on user service with correct authToken", async () => {
        await navbarPresenter.logOut(authToken);
        verify(mockService.logout(authToken)).once();
    })

    test("when logout successful, presenter tells view to clear info message displayed previously, clear user info, and navigate to login page", async () => {
        await navbarPresenter.logOut(authToken);
        verify(mockNavbarView.deleteMessage("testMessageID123")).once()
        verify(mockNavbarView.clearUserInfo()).once()
        verify(mockNavbarView.navigate("/login")).once()
        verify(mockNavbarView.displayErrorMessage(anything())).never()
        
    })

    test("When logout not successful, presenter tells view to display error message, and does not clear info message, clear user info, nor navigate to login page.", async () => {
        let error = new Error("logout failed");
        when(mockService.logout(anything())).thenThrow(error)
        await navbarPresenter.logOut(authToken);
        verify(mockNavbarView.displayErrorMessage("Failed to log user out because of exception: logout failed")).once()
        let [errorMessage] = capture(mockNavbarView.displayErrorMessage).last()
        console.log(`Displayed Error Message: ${errorMessage}`)

        verify(mockNavbarView.clearUserInfo()).never()
        verify(mockNavbarView.deleteMessage(anything())).never()
        verify(mockNavbarView.navigate("/login")).never()
    })
})
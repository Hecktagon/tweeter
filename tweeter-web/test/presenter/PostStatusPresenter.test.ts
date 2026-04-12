export {};

// import { AuthToken, Status, User } from "tweeter-shared"
// import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter" 
// import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
// import { StatusService } from "../../src/model/service/StatusService"

// describe("PostStatusPresenter", () => {
//     let mockPostStatusView: PostStatusView
//     let postStatusPresenter: PostStatusPresenter

//     let mockService: StatusService

//     const authToken: AuthToken = new AuthToken("dummyAuth123", Date.now())
//     const user: User = new User("First-name", "McLastname", "CoolAlias123", "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg")
//     const statusString: string = "very cool status"

//     beforeEach(() => {
//         mockPostStatusView = mock<PostStatusView>();
//         const mockPostStatusViewInstance = instance(mockPostStatusView)
//         when(mockPostStatusView.displayInfoMessage(anything(), anything())).thenReturn("testMessageID123")

//         const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
//         postStatusPresenter = instance(postStatusPresenterSpy)

//         mockService = mock<StatusService>();

//         when(postStatusPresenterSpy.service).thenReturn(instance(mockService))
//     })

//     test("presenter tells view to display posting status message", async () => {
//         await postStatusPresenter.submitPost(statusString, authToken, user)
//         verify(mockPostStatusView.displayInfoMessage(anything(), 0)).once()
//     })

//     test("presenter calls postStatus on post status service with correct status string, user, and authToken", async () => {
//         await postStatusPresenter.submitPost(statusString, authToken, user)
//         verify(mockService.postStatus(authToken, anything())).once()

//         let [capturedToken, capturedStatus] = capture(mockService.postStatus).last()
//         expect(capturedStatus.post).toBe(statusString)
//         expect(capturedStatus.user).toBe(user)
//     })

//     test("When posting status is successful, presenter tells view to clear info message displayed previously, clear post, and display status posted message.", async () => {
//         await postStatusPresenter.submitPost(statusString, authToken, user);
//         verify(mockPostStatusView.deleteMessage("testMessageID123")).once()
//         verify(mockPostStatusView.setPost("")).once()
//         verify(mockPostStatusView.displayInfoMessage("Status posted!", anything())).once()
//         verify(mockPostStatusView.displayErrorMessage(anything())).never()
//     })

//     test("When posting status not successful, presenter tells view to clear info message and display error message, but does not tell it to clear post, nor display status posted message.", async () => {
//         let error = new Error("posting failed");
//         when(mockService.postStatus(authToken, anything())).thenThrow(error)
//         await postStatusPresenter.submitPost(statusString, authToken, user);
//         verify(mockPostStatusView.deleteMessage(anything())).once()
//         verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: posting failed")).once()
//         let [errorMessage] = capture(mockPostStatusView.displayErrorMessage).last()
//         console.log(`Displayed Error Message: ${errorMessage}`)

//         verify(mockPostStatusView.setPost("")).never()
//         verify(mockPostStatusView.displayInfoMessage("Status posted!", anything())).never()
//     })
// })
export {};

// import PostStatus from "../../../src/components/postStatus/PostStatus"
// import { render, screen } from "@testing-library/react"
// import { PostStatusView, PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter"
// import { userEvent } from "@testing-library/user-event"
// import { mock, instance, when, anything, verify } from "@typestrong/ts-mockito"
// import "@testing-library/jest-dom"
// import { AuthToken, User } from "tweeter-shared"
// import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks"

// jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
//     ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
//     __esModule: true,
//     useUserInfo: jest.fn(),
// }));

// describe("PostStatus Component", () => {
//     let mockPSPresenter: PostStatusPresenter
//     let mockPSPresenterInstance: PostStatusPresenter
//     let mockUserInstance: User
//     let mockAuthTokenInstance: AuthToken

//     beforeAll(() => {
//         let mockUser = mock<User>();
//         let mockAuthToken = mock <AuthToken>();
//         mockUserInstance = instance(mockUser);
//         mockAuthTokenInstance = instance(mockAuthToken);

//         (useUserInfo as jest.Mock).mockReturnValue({
//             currentUser: mockUserInstance,
//             authToken: mockAuthTokenInstance,
//         });
//     })

//     beforeEach(() => {
//         mockPSPresenter = mock<PostStatusPresenter>();
//         mockPSPresenterInstance = instance(mockPSPresenter)
//         when(mockPSPresenter.submitPost(anything(), anything(), anything())).thenReturn()
//         when(mockPSPresenter.clearPost()).thenReturn()
//     })

//     test("Post Status and Clear buttons start disabled", () => {
//         const { postStatusButton, clearButton } = renderPostStatusAndGetElements(() => { return mockPSPresenterInstance })
//         expect(postStatusButton).toBeDisabled()
//         expect(clearButton).toBeDisabled()
//     })

//     test("both buttons enabled when text field has text", async () => {
//         await bothButtonsEnabled(mockPSPresenterInstance)
//     })

//     test("both buttons disabled when the text field is cleared", async () => {
//         const { postStatusButton, clearButton, textField, user } = await bothButtonsEnabled(mockPSPresenterInstance)
//         await user.clear(textField)
//         expect(postStatusButton).toBeDisabled()
//         expect(clearButton).toBeDisabled()
//     })

//     test("presenters submitPost method is called with correct parameters when the post status button is pressed", async () => {
//         const { postStatusButton, textField, user } = renderPostStatusAndGetElements(() => { return mockPSPresenterInstance })
//         const postString = "i posted"

//         await user.type(textField, postString);
//         await user.click(postStatusButton)
//         verify(mockPSPresenter.submitPost(postString, mockAuthTokenInstance, mockUserInstance)).once()
//     })
// })

// async function bothButtonsEnabled(mockPSPresenterInstance: PostStatusPresenter) {
//     const { postStatusButton, clearButton, textField, user } = renderPostStatusAndGetElements(() => { return mockPSPresenterInstance })
//     await user.type(textField, "hello world")
//     expect(postStatusButton).toBeEnabled()
//     expect(clearButton).toBeEnabled()
//     return { postStatusButton, clearButton, textField, user }
// }

// function renderPostStatus(presenterFactory: (view: PostStatusView) => PostStatusPresenter) {
//     render(
//         <div>
//             <PostStatus presenterFactory={presenterFactory} />
//         </div>
//     )
// }

// function renderPostStatusAndGetElements(presenterFactory: (view: PostStatusView) => PostStatusPresenter) {
//     const user = userEvent.setup()

//     renderPostStatus(presenterFactory)

//     const textField = screen.getByLabelText("status-text")
//     const postStatusButton = screen.getByRole("button", { name: /Post Status/i })
//     const clearButton = screen.getByRole("button", { name: /Clear/i })


//     return { user, postStatusButton, clearButton, textField }
// }
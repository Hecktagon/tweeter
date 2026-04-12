export {};

// import { MemoryRouter } from "react-router-dom"
// import Login from "../../../../src/components/authentication/login/Login"
// import { AuthView } from "../../../../src/presenter/AuthPresenter"
// import { LoginPresenter } from "../../../../src/presenter/LoginPresenter"
// import { render, screen } from "@testing-library/react"
// import { userEvent } from "@testing-library/user-event"
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import { mock, instance, when, anything, verify } from "@typestrong/ts-mockito"
// import "@testing-library/jest-dom"

// library.add(fab)

// describe("Login Component", () => {
//     let mockLoginPresenter: LoginPresenter;
//     let mockLoginPresenterInstance: LoginPresenter;

//     beforeEach(() => {
//         mockLoginPresenter = mock<LoginPresenter>();
//         mockLoginPresenterInstance = instance(mockLoginPresenter)
//         when(mockLoginPresenter.doLogin(anything(), anything(), anything())).thenReturn()
//     })

//     test("sign-in button starts disabled", () => {
//         const { signInButton } = renderLoginAndGetElements(() => { return mockLoginPresenterInstance })
//         expect(signInButton).toBeDisabled()
//     })

//     test("sign-in button enabled if both alias and password have text", async () => {
//         await enableSignInButton(mockLoginPresenterInstance)
//     })

//     test("sign in button is disabled if either field is cleared", async () => {
//         const { signInButton, aliasField, passwordField, user } = await enableSignInButton(mockLoginPresenterInstance)
//         await user.clear(aliasField)
//         expect(signInButton).toBeDisabled()

//         await user.type(aliasField, "more text")
//         expect(signInButton).toBeEnabled()

//         await user.clear(passwordField)
//         expect(signInButton).toBeDisabled()

//     })

//     test("calls presenters login function with correct parameters when sign in button is pressed", async () => {
//         const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements(() => { return mockLoginPresenterInstance })
//         const alias = "alias123"
//         const password = "pass123"

//         await user.type(aliasField, alias);
//         await user.type(passwordField, password);
//         await user.click(signInButton)
//         verify(mockLoginPresenter.doLogin(alias, password, anything())).once()
//     })
// })

// async function enableSignInButton(mockLoginPresenterInstance: LoginPresenter) {
//     const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements(() => { return mockLoginPresenterInstance })
//     await user.type(aliasField, "coolAlias123");
//     await user.type(passwordField, "coolPassword321");
//     expect(signInButton).toBeEnabled();
//     return { signInButton, aliasField, passwordField, user }
// }

// function renderLogin(presenterFactory: (view: AuthView) => LoginPresenter) {
//     render(
//         <MemoryRouter>
//             <Login presenterFactory={presenterFactory} />
//         </MemoryRouter>
//     )
// }

// function renderLoginAndGetElements(presenterFactory: (view: AuthView) => LoginPresenter) {
//     const user = userEvent.setup()

//     renderLogin(presenterFactory)

//     const signInButton = screen.getByRole("button", { name: /Sign in/i })
//     const aliasField = screen.getByLabelText("alias")
//     const passwordField = screen.getByLabelText("password")

//     return { user, signInButton, aliasField, passwordField }
// }



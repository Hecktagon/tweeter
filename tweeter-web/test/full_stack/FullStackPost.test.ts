import "isomorphic-fetch";
import { instance, mock, capture, verify } from "@typestrong/ts-mockito";
import { AuthToken, User, Status } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";
import { StatusService } from "../../src/model/service/StatusService";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { PostStatusView } from "../../src/presenter/PostStatusPresenter";

describe("Post Status Integration Test", () => {
  let authToken: AuthToken;
  let currentUser: User;

  const userService = new UserService();
  const statusService = new StatusService();

  // A minimal mock of the view — only mock what PostStatusPresenter calls
  let mockView: PostStatusView;
  let capturedInfoMessages: string[] = [];

  beforeAll(async () => {
    // Step 1: Login a real user via the service
    const [user, auth] = await userService.login("@bb", "b");
    currentUser = user;
    authToken = auth;
  });

  beforeEach(() => {
    capturedInfoMessages = [];

    // Build a minimal view implementation that records messages
    mockView = {
      displayInfoMessage: (message: string, _duration: number) => {
        capturedInfoMessages.push(message);
        return message;
      },
      displayErrorMessage: (message: string) => {
        console.error("Error displayed:", message);
      },
      deleteMessage: (_id: string) => { },
      setIsLoading: ((_loading: boolean) => { }) as React.Dispatch<React.SetStateAction<boolean>>,
      setPost: ((_post: string) => { }) as React.Dispatch<React.SetStateAction<string>>,
    };
  });

  it("posts a status and verifies it appears in the user's story", async () => {
    const presenter = new PostStatusPresenter(mockView);

    const testPost = `Integration test status - ${Date.now()}`;

    // Step 2: Post a status via the Presenter
    await presenter.submitPost(testPost, authToken, currentUser);

    // Step 3: Verify "Status posted!" message was displayed
    const postedMessage = capturedInfoMessages.find((msg) =>
      msg.toLowerCase().includes("status posted")
    );
    expect(postedMessage).toBeDefined();

    // Step 4: Retrieve the user's story and verify the new status is present
    const [statuses, _hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      currentUser.alias,
      10,
      null
    );

    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);

    const matchingStatus = statuses.find((s: Status) => s.post === testPost);
    expect(matchingStatus).toBeDefined();
    expect(matchingStatus!.user.alias).toBe(currentUser.alias);
    expect(matchingStatus!.user.firstName).toBe(currentUser.firstName);
    expect(matchingStatus!.user.lastName).toBe(currentUser.lastName);
    expect(matchingStatus!.timestamp).toBeDefined();
    expect(matchingStatus!.post).toBe(testPost);
  });
});
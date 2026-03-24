// serverFacade.integration.test.ts
import "isomorphic-fetch"; // Fix fetch not defined in Node
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import { StatusService } from "../../../src/model/service/StatusService";
import {
  RegisterRequest,
  PagedUserItemRequest,
  GetFollowCountRequest,
  PagedStatusRequest,
  User,
  Status,
  AuthToken
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();
  const statusService = new StatusService();

  let testUser: User | null = null;
  let authToken: AuthToken | null = null;

  // ---------------------------
  // Register Test
  // ---------------------------
  it("should register a new user successfully", async () => {
    const request: RegisterRequest = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      password: "password123",
      userImageString: "fakeImageBase64String",
      imageFileExtension: ".png"
    };

    const [user, auth] = await serverFacade.register(request);

    // Verify results
    expect(user).toBeInstanceOf(User);
    expect(auth).toBeInstanceOf(AuthToken);
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(user.alias).toBe("@allen");

    testUser = user;
    authToken = auth;
  });

  // ---------------------------
  // Get Followers Test
  // ---------------------------
  it("should retrieve followers of a user", async () => {
    if (!testUser || !authToken) throw new Error("Test user not registered");

    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: testUser.alias,
      pageSize: 10,
      user: null
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThan(0); 
    expect(typeof hasMore).toBe("boolean");

    const firstFollower = followers[0];
    expect(firstFollower).toBeInstanceOf(User);
    expect(firstFollower.firstName).toBeDefined();
    expect(firstFollower.lastName).toBeDefined();
    expect(firstFollower.alias).toBeDefined();
    expect(firstFollower.imageUrl).toBeDefined();
  });

  // ---------------------------
  // Get Followers/Following Count Test
  // ---------------------------
  it("should return valid follower and followee counts", async () => {
    if (!testUser || !authToken) throw new Error("Test user not registered");

    const followerCountRequest: GetFollowCountRequest = {
      token: authToken.token,
      user: testUser
    };

    const followeeCountRequest: GetFollowCountRequest = {
      token: authToken.token,
      user: testUser
    };

    const followerCount = await serverFacade.getFollowerCount(followerCountRequest);
    const followeeCount = await serverFacade.getFolloweeCount(followeeCountRequest);

    expect(followerCount).toBeGreaterThan(0);
    expect(followeeCount).toBeGreaterThan(0);
  });

  // ---------------------------
  // Story Retrieval Test
  // ---------------------------
  it("should retrieve a user's story pages", async () => {
    if (!testUser || !authToken) throw new Error("Test user not registered");

    // const storyRequest: PagedStatusRequest = {
    //   token: authToken.token,
    //   userAlias: testUser.alias,
    //   pageSize: 10,
    //   lastItem: null
    // };

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken, testUser.alias, 10, null);

    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe("boolean");

    const firstStatus = statuses[0];
    expect(firstStatus).toBeInstanceOf(Status);
    expect(firstStatus.post).toBeDefined();
    expect(firstStatus.user).toBeInstanceOf(User);
    expect(firstStatus.user.alias).toBeDefined();
    expect(firstStatus.timestamp).toBeDefined();
  });
});
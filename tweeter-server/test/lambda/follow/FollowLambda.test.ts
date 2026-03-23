import { instance, mock, when, verify, anything } from "@typestrong/ts-mockito";
import { FollowService } from "../../../src/model/service/FollowService";


import * as followHandler from "../../../src/lambda/follow/FollowLambda";
import * as unfollowHandler from "../../../src/lambda/follow/UnfollowLambda";
import * as followerStatusHandler from "../../../src/lambda/follow/GetFollowerStatusLambda";
import * as loadFollowersHandler from "../../../src/lambda/follow/GetFollowersLambda";
import * as getFollowerCountHandler from "../../../src/lambda/follow/GetFollowerCountLambda";
import * as loadFolloweesHandler from "../../../src/lambda/follow/GetFolloweesLambda";
import * as getFolloweeCountHandler from "../../../src/lambda/follow/GetFolloweeCountLambda";

describe("Follow Lambda Handlers", () => {

    let mockService: FollowService;

    beforeEach(() => {
        mockService = mock<FollowService>();

        // Override constructor calls
        jest.spyOn(FollowService.prototype, "follow");
        jest.spyOn(FollowService.prototype, "getIsFollowerStatus");
        jest.spyOn(FollowService.prototype, "loadMoreFollowers");
        jest.spyOn(FollowService.prototype, "getFollowerCount");
        jest.spyOn(FollowService.prototype, "loadMoreFollowees");
        jest.spyOn(FollowService.prototype, "getFolloweeCount");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ------------------ FOLLOW ------------------
    test("follow handler calls service and returns counts", async () => {
        const request = {
            token: "token123",
            targetUser: "userB"
        };

        jest.spyOn(FollowService.prototype, "follow")
            .mockResolvedValue([10, 5]);

        const response = await followHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.followerCount).toBe(10);
        expect(response.followeeCount).toBe(5);

        expect(FollowService.prototype.follow).toHaveBeenCalledWith("token123", "userB");
    });

    // ------------------ UNFOLLOW ------------------
    test("unfollow handler calls service and returns counts", async () => {
        const request = {
            token: "token123",
            targetUser: "userB"
        };

        jest.spyOn(FollowService.prototype, "unfollow")
            .mockResolvedValue([10, 5]);

        const response = await unfollowHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.followerCount).toBe(10);
        expect(response.followeeCount).toBe(5);

        expect(FollowService.prototype.unfollow).toHaveBeenCalledWith("token123", "userB");
    });

    // ------------------ FOLLOWER STATUS ------------------
    test("follower status handler returns correct status", async () => {
        const request = {
            token: "token123",
            user: "userA",
            selectedUser: "userB"
        };

        jest.spyOn(FollowService.prototype, "getIsFollowerStatus")
            .mockResolvedValue(true);

        const response = await followerStatusHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.isFollowing).toBe(true);

        expect(FollowService.prototype.getIsFollowerStatus)
            .toHaveBeenCalledWith("token123", "userA", "userB");
    });

    // ------------------ LOAD FOLLOWERS ------------------
    test("load more followers handler returns items and hasMore", async () => {
        const request = {
            token: "token123",
            userAlias: "userA",
            pageSize: 10,
            user: "userA"
        };

        const mockUsers = [
            {
                alias: "u1",
                firstName: "John",
                lastName: "Doe",
                imageUrl: "image1.png"
            },
            {
                alias: "u2",
                firstName: "Jane",
                lastName: "Smith",
                imageUrl: "image2.png"
            }
        ];

        jest.spyOn(FollowService.prototype, "loadMoreFollowers")
            .mockResolvedValue([mockUsers, true]);

        const response = await loadFollowersHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.items).toEqual(mockUsers);
        expect(response.hasMore).toBe(true);

        expect(FollowService.prototype.loadMoreFollowers)
            .toHaveBeenCalledWith("token123", "userA", 10, "userA");
    });

    // ------------------ FOLLOWER COUNT ------------------
    test("get follower count handler returns count", async () => {
        const request = {
            token: "token123",
            user: "userA"
        };

        jest.spyOn(FollowService.prototype, "getFollowerCount")
            .mockResolvedValue(42);

        const response = await getFollowerCountHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.count).toBe(42);

        expect(FollowService.prototype.getFollowerCount)
            .toHaveBeenCalledWith("token123", "userA");
    });

    // ------------------ LOAD FOLLOWEES ------------------
    test("load more followees handler returns items and hasMore", async () => {
        const request = {
            token: "token123",
            userAlias: "userA",
            pageSize: 10,
            user: "userA"
        };

        const mockUsers = [
            {
                alias: "u3",
                firstName: "Jake",
                lastName: "Statefarm",
                imageUrl: "image3.png"
            },
            {
                alias: "u4",
                firstName: "Janet",
                lastName: "Interplanet",
                imageUrl: "image4.png"
            }
        ];

        jest.spyOn(FollowService.prototype, "loadMoreFollowees")
            .mockResolvedValue([mockUsers, false]);

        const response = await loadFolloweesHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.items).toEqual(mockUsers);
        expect(response.hasMore).toBe(false);

        expect(FollowService.prototype.loadMoreFollowees)
            .toHaveBeenCalledWith("token123", "userA", 10, "userA");
    });

    // ------------------ FOLLOWEE COUNT ------------------
    test("get followee count handler returns count", async () => {
        const request = {
            token: "token123",
            user: "userA"
        };

        jest.spyOn(FollowService.prototype, "getFolloweeCount")
            .mockResolvedValue(99);

        const response = await getFolloweeCountHandler.handler(request as any);

        expect(response.success).toBe(true);
        expect(response.count).toBe(99);

        expect(FollowService.prototype.getFolloweeCount)
            .toHaveBeenCalledWith("token123", "userA");
    });

});
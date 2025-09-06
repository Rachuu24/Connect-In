import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    // Actions don't have db; check auth directly
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const url = await ctx.storage.generateUploadUrl();
    return url;
  },
});

export const setProfileImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("alumni")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!profile) {
      throw new Error("Profile not found. Please create your profile first.");
    }

    await ctx.db.patch(profile._id, { profileImageId: args.storageId });
    return profile._id;
  },
});
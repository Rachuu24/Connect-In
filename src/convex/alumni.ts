import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getAlumniProfile = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    const userId = args.userId || currentUser._id;
    const profile = await ctx.db
      .query("alumni")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});

export const getAllAlumni = query({
  args: {
    limit: v.optional(v.number()),
    graduationYear: v.optional(v.number()),
    major: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("alumni").withIndex("by_public", (q) => q.eq("isPublic", true));

    // Use strict undefined checks so TypeScript narrows the types
    const { graduationYear, major } = args;

    if (graduationYear !== undefined) {
      query = ctx.db
        .query("alumni")
        .withIndex("by_graduation_year", (q) => q.eq("graduationYear", graduationYear));
    }

    if (major !== undefined) {
      query = ctx.db.query("alumni").withIndex("by_major", (q) => q.eq("major", major));
    }

    const alumni = await query.take(args.limit || 50);
    
    // Get user info for each alumni
    const alumniWithUsers = await Promise.all(
      alumni.map(async (alum) => {
        const user = await ctx.db.get(alum.userId);
        return { ...alum, user };
      })
    );

    return alumniWithUsers;
  },
});

export const createOrUpdateProfile = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    graduationYear: v.number(),
    degree: v.string(),
    major: v.string(),
    currentPosition: v.optional(v.string()),
    currentCompany: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    isPublic: v.boolean(),
    mentorshipAvailable: v.boolean(),
    skills: v.array(v.string()),
    interests: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("alumni")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, args);
      return existingProfile._id;
    } else {
      return await ctx.db.insert("alumni", {
        userId: user._id,
        ...args,
      });
    }
  },
});

export const searchAlumni = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const alumni = await ctx.db
      .query("alumni")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .collect();

    const filtered = alumni.filter((alum) => {
      const searchLower = args.searchTerm.toLowerCase();
      return (
        alum.firstName.toLowerCase().includes(searchLower) ||
        alum.lastName.toLowerCase().includes(searchLower) ||
        alum.major.toLowerCase().includes(searchLower) ||
        alum.currentCompany?.toLowerCase().includes(searchLower) ||
        alum.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    });

    return filtered;
  },
});
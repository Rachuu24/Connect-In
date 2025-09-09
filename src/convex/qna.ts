import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const listRecentQuestions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("qnaQuestions")
      .order("desc")
      .take(args.limit ?? 20);
    return items;
  },
});

export const countQuestions = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("qnaQuestions").collect();
    return all.length;
  },
});

export const getQuestionWithAnswers = query({
  args: { questionId: v.id("qnaQuestions") },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) return null;
    const answers = await ctx.db
      .query("qnaAnswers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .order("asc")
      .collect();
    return { question, answers };
  },
});

export const askQuestion = mutation({
  args: {
    body: v.string(),
    tags: v.optional(v.array(v.string())),
    isAnonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const id = await ctx.db.insert("qnaQuestions", {
      authorId: user._id,
      body: args.body,
      tags: args.tags ?? [],
      isAnonymous: args.isAnonymous ?? true,
      upvotes: 0,
    });
    return id;
  },
});

export const answerQuestion = mutation({
  args: {
    questionId: v.id("qnaQuestions"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const q = await ctx.db.get(args.questionId);
    if (!q) throw new Error("Question not found");
    const id = await ctx.db.insert("qnaAnswers", {
      questionId: args.questionId,
      authorId: user._id,
      body: args.body,
      upvotes: 0,
    });
    return id;
  },
});

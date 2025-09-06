import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getAllEvents = query({
  args: { 
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("events").withIndex("by_public", (q) => q.eq("isPublic", true));

    // Use strict undefined checks for proper narrowing
    const { category } = args;
    if (category !== undefined) {
      query = ctx.db.query("events").withIndex("by_category", (q) => q.eq("category", category));
    }

    const events = await query
      .order("desc")
      .take(args.limit || 20);

    // Get creator info for each event
    const eventsWithCreators = await Promise.all(
      events.map(async (event) => {
        const creator = await ctx.db.get(event.createdBy);
        const registrationCount = await ctx.db
          .query("eventRegistrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();
        
        return { 
          ...event, 
          creator,
          registrationCount: registrationCount.length 
        };
      })
    );

    return eventsWithCreators;
  },
});

export const getUpcomingEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_date")
      .filter((q) => q.and(
        q.gte(q.field("startDate"), now),
        q.eq(q.field("isPublic"), true)
      ))
      .take(args.limit || 5);

    return events;
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    location: v.optional(v.string()),
    isVirtual: v.boolean(),
    virtualLink: v.optional(v.string()),
    maxAttendees: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    isPublic: v.boolean(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("events", {
      ...args,
      createdBy: user._id,
    });
  },
});

export const registerForEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if already registered
    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event_and_user", (q) => 
        q.eq("eventId", args.eventId).eq("userId", user._id)
      )
      .unique();

    if (existing) {
      throw new Error("Already registered for this event");
    }

    return await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      userId: user._id,
      registeredAt: Date.now(),
      status: "registered",
    });
  },
});

export const getUserRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const eventsWithDetails = await Promise.all(
      registrations.map(async (reg) => {
        const event = await ctx.db.get(reg.eventId);
        return { ...reg, event };
      })
    );

    return eventsWithDetails;
  },
});
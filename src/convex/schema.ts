import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Alumni Platform Tables
    alumni: defineTable({
      userId: v.id("users"), // Reference to user account
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
    })
      .index("by_user", ["userId"])
      .index("by_graduation_year", ["graduationYear"])
      .index("by_major", ["major"])
      .index("by_public", ["isPublic"]),

    events: defineTable({
      title: v.string(),
      description: v.string(),
      startDate: v.number(),
      endDate: v.number(),
      location: v.optional(v.string()),
      isVirtual: v.boolean(),
      virtualLink: v.optional(v.string()),
      maxAttendees: v.optional(v.number()),
      registrationDeadline: v.optional(v.number()),
      createdBy: v.id("users"),
      isPublic: v.boolean(),
      category: v.string(), // "networking", "career", "social", etc.
      imageUrl: v.optional(v.string()),
    })
      .index("by_creator", ["createdBy"])
      .index("by_date", ["startDate"])
      .index("by_category", ["category"])
      .index("by_public", ["isPublic"]),

    eventRegistrations: defineTable({
      eventId: v.id("events"),
      userId: v.id("users"),
      registeredAt: v.number(),
      status: v.string(), // "registered", "attended", "cancelled"
    })
      .index("by_event", ["eventId"])
      .index("by_user", ["userId"])
      .index("by_event_and_user", ["eventId", "userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;

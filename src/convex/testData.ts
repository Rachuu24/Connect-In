import { mutation } from "./_generated/server";

export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Avoid reseeding if data already exists
    const existingAlumni = await ctx.db.query("alumni").take(1);
    const existingEvents = await ctx.db.query("events").take(1);
    if (existingAlumni.length > 0 || existingEvents.length > 0) {
      return { success: true, message: "Test data already present. Skipping reseed." };
    }

    // Create test users
    const users = [
      { name: "Sarah Johnson", email: "sarah@example.com" },
      { name: "Michael Chen", email: "michael@example.com" },
      { name: "Emily Rodriguez", email: "emily@example.com" },
      { name: "David Kim", email: "david@example.com" },
    ];

    const userIds = await Promise.all(
      users.map((u) =>
        ctx.db.insert("users", {
          name: u.name,
          email: u.email,
          image: undefined,
          emailVerificationTime: undefined,
          isAnonymous: false,
          role: "member",
        }),
      ),
    );

    // Create test alumni profiles (linked to created users)
    const testAlumni = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        graduationYear: 2018,
        degree: "Bachelor of Science",
        major: "Computer Science",
        currentPosition: "Senior Software Engineer",
        currentCompany: "Tech Corp",
        location: "San Francisco, CA",
        bio:
          "Passionate about building scalable web applications and mentoring junior developers.",
        linkedinUrl: "https://linkedin.com/in/sarahjohnson",
        twitterUrl: undefined,
        websiteUrl: undefined,
        phoneNumber: undefined,
        isPublic: true,
        mentorshipAvailable: true,
        skills: ["JavaScript", "React", "Node.js", "Python"],
        interests: ["Web Development", "AI/ML", "Startups"],
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        graduationYear: 2015,
        degree: "Master of Business Administration",
        major: "Business Administration",
        currentPosition: "Product Manager",
        currentCompany: "Innovation Labs",
        location: "New York, NY",
        bio: "Product leader with 8+ years experience in fintech and healthcare.",
        linkedinUrl: "https://linkedin.com/in/michaelchen",
        twitterUrl: undefined,
        websiteUrl: undefined,
        phoneNumber: undefined,
        isPublic: true,
        mentorshipAvailable: true,
        skills: ["Product Management", "Strategy", "Analytics"],
        interests: ["Fintech", "Healthcare", "Product Strategy"],
      },
      {
        firstName: "Emily",
        lastName: "Rodriguez",
        graduationYear: 2020,
        degree: "Bachelor of Arts",
        major: "Marketing",
        currentPosition: "Marketing Director",
        currentCompany: "Creative Agency",
        location: "Austin, TX",
        bio:
          "Creative marketing professional specializing in digital campaigns and brand strategy.",
        linkedinUrl: undefined,
        twitterUrl: undefined,
        websiteUrl: undefined,
        phoneNumber: undefined,
        isPublic: true,
        mentorshipAvailable: false,
        skills: ["Digital Marketing", "Brand Strategy", "Content Creation"],
        interests: ["Digital Marketing", "Creative Design", "Social Media"],
      },
      {
        firstName: "David",
        lastName: "Kim",
        graduationYear: 2012,
        degree: "Bachelor of Engineering",
        major: "Mechanical Engineering",
        currentPosition: "Engineering Manager",
        currentCompany: "Manufacturing Inc",
        location: "Detroit, MI",
        bio:
          "Engineering leader focused on sustainable manufacturing and process optimization.",
        linkedinUrl: undefined,
        twitterUrl: undefined,
        websiteUrl: undefined,
        phoneNumber: undefined,
        isPublic: true,
        mentorshipAvailable: true,
        skills: ["Mechanical Engineering", "Project Management", "Sustainability"],
        interests: ["Sustainable Technology", "Manufacturing", "Leadership"],
      },
    ];

    await Promise.all(
      testAlumni.map((alum, idx) =>
        ctx.db.insert("alumni", {
          userId: userIds[idx]!,
          ...alum,
        }),
      ),
    );

    // Create test events (linked to first two users as creators)
    const now = Date.now();
    const testEvents = [
      {
        title: "Annual Alumni Networking Mixer",
        description:
          "Join us for an evening of networking, refreshments, and reconnecting with fellow alumni.",
        startDate: now + 7 * 24 * 60 * 60 * 1000,
        endDate: now + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
        location: "Downtown Convention Center",
        isVirtual: false,
        virtualLink: undefined,
        maxAttendees: 200,
        registrationDeadline: now + 5 * 24 * 60 * 60 * 1000,
        isPublic: true,
        category: "networking",
        imageUrl: undefined,
        createdBy: userIds[0]!,
      },
      {
        title: "Career Development Workshop",
        description:
          "Learn about the latest trends in your industry and develop your professional skills.",
        startDate: now + 14 * 24 * 60 * 60 * 1000,
        endDate: now + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
        location: undefined,
        isVirtual: true,
        virtualLink: "https://zoom.us/j/123456789",
        maxAttendees: 100,
        registrationDeadline: now + 12 * 24 * 60 * 60 * 1000,
        isPublic: true,
        category: "career",
        imageUrl: undefined,
        createdBy: userIds[1]!,
      },
      {
        title: "Alumni Homecoming Weekend",
        description:
          "Celebrate with your classmates during our annual homecoming festivities.",
        startDate: now + 30 * 24 * 60 * 60 * 1000,
        endDate: now + 32 * 24 * 60 * 60 * 1000,
        location: "University Campus",
        isVirtual: false,
        virtualLink: undefined,
        maxAttendees: 500,
        registrationDeadline: now + 25 * 24 * 60 * 60 * 1000,
        isPublic: true,
        category: "social",
        imageUrl: undefined,
        createdBy: userIds[0]!,
      },
    ];

    const eventIds = await Promise.all(
      testEvents.map((evt) => ctx.db.insert("events", evt)),
    );

    // Optional: a couple of registrations
    await ctx.db.insert("eventRegistrations", {
      eventId: eventIds[0]!,
      userId: userIds[2]!,
      registeredAt: now,
      status: "registered",
    });
    await ctx.db.insert("eventRegistrations", {
      eventId: eventIds[1]!,
      userId: userIds[3]!,
      registeredAt: now,
      status: "registered",
    });

    // Seed QnA test data
    const q1 = await ctx.db.insert("qnaQuestions", {
      authorId: userIds[0]!,
      body: "How to prepare for software engineering interviews as a recent grad?",
      tags: ["career", "software", "interview"],
      isAnonymous: true,
      upvotes: 3,
    });
    const q2 = await ctx.db.insert("qnaQuestions", {
      authorId: userIds[2]!,
      body: "Best way to transition from marketing to product management?",
      tags: ["career", "transition", "product"],
      isAnonymous: true,
      upvotes: 2,
    });
    await ctx.db.insert("qnaAnswers", {
      questionId: q1,
      authorId: userIds[1]!,
      body: "Practice DSA, build small projects, and do mock interviews with peers.",
      upvotes: 2,
    });
    await ctx.db.insert("qnaAnswers", {
      questionId: q1,
      authorId: userIds[3]!,
      body: "Use platforms like LeetCode and focus on fundamentals. Networking helps a lot.",
      upvotes: 1,
    });
    await ctx.db.insert("qnaAnswers", {
      questionId: q2,
      authorId: userIds[0]!,
      body: "Highlight transferable skills, take a PM course, and collaborate with PMs internally.",
      upvotes: 1,
    });

    return { success: true, message: "Seeded users, alumni, events, registrations, and QnA." };
  },
});
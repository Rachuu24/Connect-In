import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Briefcase, 
  GraduationCap,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router";
import { LogoDropdown } from "@/components/LogoDropdown";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation } from "convex/react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const alumni = useQuery(api.alumni.getAllAlumni, { limit: 6 });
  const upcomingEvents = useQuery(api.events.getUpcomingEvents, { limit: 4 });
  const userProfile = useQuery(api.alumni.getAlumniProfile, {});
  const [tab, setTab] = useState<"overview" | "directory" | "events" | "mentorship" | "donations">("overview");
  const mentors = useQuery(api.alumni.getMentors, { limit: 12 });
  const setMentorAvailability = useMutation(api.alumni.setMentorshipAvailability);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LogoDropdown />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Connect-In</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name || user.email}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" onClick={() => setTab("directory")}>Directory</Button>
              <Button variant="ghost" onClick={() => setTab("events")}>Events</Button>
              <Button variant="ghost" onClick={() => setTab("mentorship")}>Mentorship</Button>
              <Button variant="ghost" onClick={() => setTab("donations")}>Donations</Button>
              <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome to Connect-In
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Connect, engage, and grow with fellow alumni from around the world.
            </p>
            {!userProfile && (
              <Button onClick={() => navigate("/profile")} size="lg">
                Complete Your Profile
              </Button>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{alumni?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Alumni</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{upcomingEvents?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Active Discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">$12.5K</p>
                  <p className="text-sm text-muted-foreground">Donations This Year</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Alumni */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Recent Alumni</span>
                  </CardTitle>
                  <CardDescription>
                    Connect with alumni who recently joined the network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alumni?.slice(0, 3).map((alum) => (
                      <div key={alum._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {alum.firstName[0]}{alum.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{alum.firstName} {alum.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {alum.currentPosition} • Class of {alum.graduationYear}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setTab("directory")}>
                    View All Alumni
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                  <CardDescription>
                    Don't miss these exciting alumni events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents?.slice(0, 3).map((event) => (
                      <div key={event._id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setTab("events")}>
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="directory">
            <Card>
              <CardHeader>
                <CardTitle>Alumni Directory</CardTitle>
                <CardDescription>
                  Browse and connect with alumni from your institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alumni?.map((alum) => (
                    <div key={alum._id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {alum.firstName[0]}{alum.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{alum.firstName} {alum.lastName}</h4>
                          <p className="text-sm text-muted-foreground">Class of {alum.graduationYear}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alum.major}</p>
                      {alum.currentPosition && (
                        <p className="text-sm">{alum.currentPosition}</p>
                      )}
                      {alum.currentCompany && (
                        <p className="text-sm text-muted-foreground">{alum.currentCompany}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events & Networking</CardTitle>
                <CardDescription>
                  Join alumni events and expand your professional network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents?.map((event) => (
                    <div key={event._id} className="p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <Button size="sm">Register</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Mentorship Program</span>
                </CardTitle>
                <CardDescription>
                  Connect with mentors or become a mentor yourself
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg border">
                    <GraduationCap className="h-8 w-8 text-primary mb-4" />
                    <h4 className="font-medium mb-2">Find a Mentor</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with experienced alumni who can guide your career journey
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const el = document.getElementById("mentorsList");
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      Browse Mentors
                    </Button>
                  </div>
                  
                  <div className="p-6 rounded-lg border">
                    <TrendingUp className="h-8 w-8 text-primary mb-4" />
                    <h4 className="font-medium mb-2">Become a Mentor</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share your expertise and help fellow alumni grow professionally
                    </p>
                    <Button
                      className="w-full"
                      onClick={async () => {
                        try {
                          await setMentorAvailability({ available: true });
                          toast("You're now listed as a mentor!");
                        } catch (err: any) {
                          const msg = err?.message || "";
                          if (msg.toLowerCase().includes("profile not found")) {
                            toast("Complete your profile to join as a mentor.");
                            navigate("/profile");
                          } else {
                            toast(`Failed to update: ${msg || "Unknown error"}`);
                          }
                        }
                      }}
                    >
                      Join as Mentor
                    </Button>
                  </div>
                </div>

                {/* Mentors List */}
                <div id="mentorsList" className="mt-8">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Available Mentors
                  </h4>
                  {((mentors ?? []).length === 0) ? (
                    <div className="p-4 rounded-lg border text-sm text-muted-foreground">
                      No mentors are available right now.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(mentors ?? []).map((alum) => (
                        <div key={alum._id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                              <span className="font-medium text-primary">
                                {alum.firstName[0]}
                                {alum.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium">{alum.firstName} {alum.lastName}</h5>
                              <p className="text-xs text-muted-foreground">
                                Class of {alum.graduationYear}{alum.major ? ` • ${alum.major}` : ""}
                              </p>
                            </div>
                          </div>
                          {alum.currentPosition && (
                            <p className="text-sm">{alum.currentPosition}</p>
                          )}
                          {alum.currentCompany && (
                            <p className="text-sm text-muted-foreground">{alum.currentCompany}</p>
                          )}
                          {alum.skills?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {alum.skills.slice(0, 4).map((s, i) => (
                                <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Support Your Alma Mater</span>
                </CardTitle>
                <CardDescription>
                  Make a difference through donations and fundraising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border">
                    <h4 className="font-medium mb-2">Annual Fund Campaign</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Support student scholarships and campus improvements
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm">Progress: $12,500 of $50,000</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-4">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <Button>Make a Donation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
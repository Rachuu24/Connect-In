import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { MapPin, Clock, Megaphone, GraduationCap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { LogoDropdown } from "@/components/LogoDropdown";

export default function NoticeBoardPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const allEvents = useQuery(api.events.getAllEvents, { limit: 50 });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const alumniNotices = (allEvents ?? []).filter((e) =>
    ["networking", "social"].includes((e.category || "").toLowerCase()),
  );
  const studentNotices = (allEvents ?? []).filter((e) =>
    ["career", "workshop"].includes((e.category || "").toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LogoDropdown />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Notice Board</h1>
                <p className="text-sm text-muted-foreground">Announcements and updates for our community</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Alumni Column */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Alumni Board
              </CardTitle>
              <CardDescription>Networking, reunions, and community announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(alumniNotices.length ? alumniNotices : (allEvents ?? []).slice(0, 5)).map((notice) => (
                  <motion.div
                    key={notice._id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{notice.title}</h4>
                      {notice.category && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {notice.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{notice.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(notice.startDate).toLocaleDateString()}</span>
                      </div>
                      {notice.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{notice.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {(alumniNotices.length === 0 && (allEvents ?? []).length === 0) && (
                  <div className="p-4 rounded-lg border text-sm text-muted-foreground">
                    No alumni announcements right now.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Students Column */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Students Board
              </CardTitle>
              <CardDescription>Workshops, mentorship, and career opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(studentNotices.length ? studentNotices : (allEvents ?? []).slice(0, 5)).map((notice) => (
                  <motion.div
                    key={notice._id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{notice.title}</h4>
                      {notice.category && (
                        <span className="text-xs bg-accent/20 text-foreground px-2 py-1 rounded">
                          {notice.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{notice.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(notice.startDate).toLocaleDateString()}</span>
                      </div>
                      {notice.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{notice.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {(studentNotices.length === 0 && (allEvents ?? []).length === 0) && (
                  <div className="p-4 rounded-lg border text-sm text-muted-foreground">
                    No student announcements right now.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

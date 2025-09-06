import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogoDropdown } from "@/components/LogoDropdown";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const userProfile = useQuery(api.alumni.getAlumniProfile, {});
  const saveProfile = useMutation(api.alumni.createOrUpdateProfile);

  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const setProfileImage = useMutation(api.files.setProfileImage);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <LogoDropdown />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-sm text-muted-foreground">
                  {user.name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Complete or update your alumni profile. This helps others discover and connect with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Profile Header with Avatar */}
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="size-24 md:size-28 rounded-full ring-2 ring-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden">
                  {userProfile?.profileImageUrl ? (
                    <img
                      src={userProfile.profileImageUrl}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xl md:text-2xl font-semibold text-primary">
                      {(userProfile?.firstName?.[0] ?? (user.name || user.email || "U")[0])}
                      {(userProfile?.lastName?.[0] ?? "")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : (user.name || user.email)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userProfile?.currentPosition ?? "Add your position"}
                      {userProfile?.currentCompany ? ` • ${userProfile.currentCompany}` : ""}
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.currentTarget.files?.[0];
                        if (!file) return;
                        try {
                          if (file.size > 5 * 1024 * 1024) {
                            toast("Please upload an image under 5MB.");
                            return;
                          }
                          const uploadUrl = await generateUploadUrl({});
                          const res = await fetch(uploadUrl, {
                            method: "POST",
                            headers: { "Content-Type": file.type },
                            body: file,
                          });
                          const json = await res.json();
                          if (!res.ok) throw new Error(json?.message ?? "Upload failed");
                          const storageId = json.storageId as string;
                          await setProfileImage({ storageId: storageId as any });
                          toast("Profile photo updated!");
                        } catch (err: any) {
                          toast(`Failed to upload image: ${err?.message ?? "Unknown error"}`);
                        } finally {
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(ev) => {
                        const input = (ev.currentTarget.previousSibling as HTMLInputElement) || null;
                        input?.click();
                      }}
                    >
                      Update Photo
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mb-6" />

            {/* Profile Form */}
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const str = (name: string) => {
                  const val = (fd.get(name) as string | null) ?? "";
                  return val.trim();
                };
                const opt = (name: string) => {
                  const val = str(name);
                  return val.length ? val : undefined;
                };
                const num = (name: string) => {
                  const n = Number(str(name));
                  return Number.isFinite(n) ? n : 0;
                };
                const bool = (name: string) => {
                  const v = fd.get(name);
                  return v === "on" || v === "true" || v === "1";
                };
                const list = (name: string) => {
                  const raw = str(name);
                  const arr = raw.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
                  return arr;
                };

                try {
                  await saveProfile({
                    firstName: str("firstName") || "First",
                    lastName: str("lastName") || "Last",
                    graduationYear: num("graduationYear") || new Date().getFullYear(),
                    degree: str("degree") || "Bachelor",
                    major: str("major") || "Undeclared",
                    currentPosition: opt("currentPosition"),
                    currentCompany: opt("currentCompany"),
                    location: opt("location"),
                    bio: opt("bio"),
                    linkedinUrl: opt("linkedinUrl"),
                    twitterUrl: opt("twitterUrl"),
                    websiteUrl: opt("websiteUrl"),
                    phoneNumber: opt("phoneNumber"),
                    isPublic: bool("isPublic"),
                    mentorshipAvailable: bool("mentorshipAvailable"),
                    skills: list("skills"),
                    interests: list("interests"),
                  });
                  toast("Profile saved successfully");
                  navigate("/dashboard");
                } catch (err: any) {
                  toast(`Failed to save profile: ${err?.message ?? "Unknown error"}`);
                }
              }}
            >
              {/* Personal */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Personal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">First Name</label>
                    <Input name="firstName" defaultValue={userProfile?.firstName ?? ""} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Last Name</label>
                    <Input name="lastName" defaultValue={userProfile?.lastName ?? ""} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Graduation Year</label>
                    <Input name="graduationYear" type="number" defaultValue={userProfile?.graduationYear ?? ""} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Location</label>
                    <Input name="location" defaultValue={userProfile?.location ?? ""} />
                  </div>
                </div>
              </div>

              {/* Academic */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Academic</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Degree</label>
                    <Input name="degree" defaultValue={userProfile?.degree ?? ""} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Major</label>
                    <Input name="major" defaultValue={userProfile?.major ?? ""} required />
                  </div>
                </div>
              </div>

              {/* Professional */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Professional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Current Position</label>
                    <Input name="currentPosition" defaultValue={userProfile?.currentPosition ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Current Company</label>
                    <Input name="currentCompany" defaultValue={userProfile?.currentCompany ?? ""} />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <label className="text-sm">Bio</label>
                  <Textarea name="bio" defaultValue={userProfile?.bio ?? ""} className="min-h-[100px]" />
                </div>
              </div>

              {/* Links & Contact */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Links & Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">LinkedIn URL</label>
                    <Input name="linkedinUrl" defaultValue={userProfile?.linkedinUrl ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Twitter URL</label>
                    <Input name="twitterUrl" defaultValue={userProfile?.twitterUrl ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Website</label>
                    <Input name="websiteUrl" defaultValue={userProfile?.websiteUrl ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Phone Number</label>
                    <Input name="phoneNumber" defaultValue={userProfile?.phoneNumber ?? ""} />
                  </div>
                </div>
              </div>

              {/* Skills & Interests */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Skills & Interests</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Skills (comma-separated)</label>
                    <Input
                      name="skills"
                      defaultValue={(userProfile?.skills ?? []).join(", ")}
                      placeholder="React, Node.js, Product Management"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Interests (comma-separated)</label>
                    <Input
                      name="interests"
                      defaultValue={(userProfile?.interests ?? []).join(", ")}
                      placeholder="AI/ML, Startups, Design"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="isPublic"
                      defaultChecked={userProfile?.isPublic ?? true}
                      className="h-4 w-4"
                    />
                    Public Profile
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="mentorshipAvailable"
                      defaultChecked={userProfile?.mentorshipAvailable ?? false}
                      className="h-4 w-4"
                    />
                    Open to Mentorship
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit">Save Profile</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

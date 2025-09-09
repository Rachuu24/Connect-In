import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { LogoDropdown } from "@/components/LogoDropdown";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Send, Tags, ArrowLeft } from "lucide-react";

type Question = NonNullable<ReturnType<typeof useQuery>> extends infer T ? any : any;

export default function QnAPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const questions = useQuery(api.qna.listRecentQuestions, { limit: 30 });
  const ask = useMutation(api.qna.askQuestion);
  const answer = useMutation(api.qna.answerQuestion);

  const [questionBody, setQuestionBody] = useState("");
  const [tags, setTags] = useState("");
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const selected = useMemo(
    () => (openQuestionId ? openQuestionId : (questions?.[0]?._id ?? null)),
    [openQuestionId, questions]
  );

  const thread = useQuery(
    api.qna.getQuestionWithAnswers,
    selected ? { questionId: selected as any } : "skip"
  );

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LogoDropdown />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Anonymous QnA</h1>
                <p className="text-sm text-muted-foreground">
                  Ask anything career or study related—answers from alumni and peers.
                </p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ask box */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Ask a Question
            </CardTitle>
            <CardDescription>Anonymous by default. Keep it clear and specific.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={questionBody}
              onChange={(e) => setQuestionBody(e.target.value)}
              placeholder="What's your question?"
              className="min-h-[120px]"
            />
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-muted-foreground" />
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated, e.g. software, interview)"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={async () => {
                  const body = questionBody.trim();
                  if (!body) return toast("Please enter your question.");
                  const tagList = tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  try {
                    await ask({ body, tags: tagList, isAnonymous: true });
                    setQuestionBody("");
                    setTags("");
                    toast("Question posted!");
                  } catch (e: any) {
                    toast(`Failed to post: ${e?.message ?? "Unknown error"}`);
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Threads list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <CardDescription>Click to view answers or reply</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(questions ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground">No questions yet. Be the first!</div>
            ) : (
              (questions ?? []).map((q) => (
                <button
                  key={q._id}
                  onClick={() => setOpenQuestionId(q._id)}
                  className={`w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                    (openQuestionId ?? questions?.[0]?._id) === q._id ? "border-primary" : ""
                  }`}
                >
                  <div className="text-sm">{q.body}</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {q.tags?.slice(0, 4).map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-muted px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Thread view */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thread</CardTitle>
            <CardDescription>View answers and contribute</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!thread ? (
              <div className="text-sm text-muted-foreground">Select a question to view the thread.</div>
            ) : thread === null ? (
              <div className="text-sm text-muted-foreground">Question not found.</div>
            ) : (
              <>
                <div className="p-3 rounded-lg border">
                  <div className="font-medium mb-2">Question</div>
                  <div className="text-sm">{thread.question.body}</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {(thread.question.tags ?? []).slice(0, 6).map((t: string, i: number) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-medium">Answers</div>
                  {(thread.answers ?? []).length === 0 ? (
                    <div className="text-sm text-muted-foreground">No answers yet.</div>
                  ) : (
                    (thread.answers ?? []).map((a: any) => (
                      <div key={a._id} className="p-3 rounded-lg border">
                        <div className="text-sm">{a.body}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2">
                  <Textarea
                    placeholder="Write your answer..."
                    className="min-h-[100px]"
                    id="answerBox"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={async () => {
                        const el = document.getElementById("answerBox") as HTMLTextAreaElement | null;
                        const val = el?.value?.trim() ?? "";
                        if (!val) return toast("Please write an answer first.");
                        try {
                          await answer({ questionId: thread.question._id, body: val });
                          if (el) el.value = "";
                          toast("Answer posted!");
                        } catch (e: any) {
                          toast(`Failed to post answer: ${e?.message ?? "Unknown error"}`);
                        }
                      }}
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Answer
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
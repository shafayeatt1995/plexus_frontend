"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ActivityFeed } from "@/components/ActivityFeed";
import Header from "../components/Header";
import api from "../server/apiFetch";
import socket from "../utils/socket";
import { authUser, refreshToken } from "../services/nextAuth";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [authUserData, setAuthUserData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!text.trim()) return;
      setLoading(true);
      const { item } = await api.post("/summary", {
        text,
        socketID: socket.id,
      });
      setSummary(item);
      toast("Summary generated!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast("Error", {
        description: error?.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      await refreshToken();
      await setUser();
    }
  };
  const setUser = async () => {
    try {
      const user = await authUser();
      setAuthUserData(user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setUser();
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="space-y-6 sticky top-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Create Summary
                  </CardTitle>
                  <CardDescription>
                    Enter your text below and get an AI-powered summary
                    instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Paste your text here... (articles, documents, research papers, etc.)"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="min-h-[200px] resize-none"
                      disabled={loading}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.length} characters
                      </span>
                      <Button
                        type="submit"
                        disabled={
                          !authUserData ||
                          authUserData?.tokens <= 0 ||
                          !text.trim() ||
                          loading
                        }
                        variant="green"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Summarizing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Summarize
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  {summary?.output && (
                    <div className="p-3 bg-muted rounded-lg mt-3">
                      <p className="text-sm font-medium text-primary mb-1">
                        Summary:
                      </p>
                      <p className="text-sm">{summary.output}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

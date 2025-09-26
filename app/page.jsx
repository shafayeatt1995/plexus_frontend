"use client";

import { useState } from "react";
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
import Image from "next/image";

const initialSummaries = [
  {
    id: "1",
    originalText:
      "Artificial intelligence has revolutionized the way we approach problem-solving in various industries. From healthcare to finance, AI systems are now capable of processing vast amounts of data and providing insights that were previously impossible to obtain. Machine learning algorithms can identify patterns in complex datasets, enabling predictive analytics and automated decision-making processes.",
    summary:
      "AI has transformed problem-solving across industries like healthcare and finance by processing large datasets, identifying patterns, and enabling predictive analytics and automated decisions.",
    timestamp: new Date(Date.now() - 300000),
    user: "Alice",
    compressionRatio: 65,
  },
];

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!text.trim()) return;
      setLoading(true);
      setText("");

      // toast("Summary generated!", {
      //   description: `Compressed by ${data.compressionRatio}% (${data.originalLength} → ${data.summaryLength} chars)`,
      // });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast("Error", {
        description: error?.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-4">
            <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
            <h1 className="text-4xl font-bold text-balance">AI Summary Feed</h1>
          </div>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Transform your text into concise summaries powered by advanced AI.
            Share insights and discover what others are summarizing in
            real-time.
          </p>
        </div>

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
                        disabled={!text.trim() || loading || text.length < 1}
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

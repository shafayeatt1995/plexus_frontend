"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Clock,
  TrendingDown,
  Wifi,
  WifiOff,
  LogOutIcon,
  CoinsIcon,
  UserIcon,
  CheckIcon,
  Loader2Icon,
  ReceiptTextIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { authUser, logOut } from "@/services/nextAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import api from "../server/apiFetch";
import { useRouter } from "next/navigation";
import socket from "@/utils/socket";

export function ActivityFeed() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isConnected, setIsConnected] = useState(true);
  const [summaries, setSummaries] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [features, setFeatures] = useState([
    "Feature 1",
    "Feature 2",
    "Feature 3",
    "Feature 4",
    "Feature 5",
  ]);
  const [priceLoading, setPriceLoading] = useState(null);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - new Date(date).getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };
  const setAuthUser = async () => {
    const user = await authUser();
    setUser(user);
  };
  const logout = async () => {
    await logOut();
    setUser(null);
  };
  const purchasePlan = async (price) => {
    try {
      setPriceLoading(price);
      const data = await api.post("/checkout-session", { price });
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setPriceLoading(null);
    }
  };
  const purchaseHistory = () => {
    router.push("/purchase-history");
  };
  const fetchSummary = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const { items, total } = await api.get("/summary", {
        page,
        limit,
      });
      setSummaries((prev) => [...prev, ...items]);
      setTotal(total);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setInit(true);
    }
  };
  const getCompression = (summary) => {
    const inputLength = summary?.input?.length || 0;
    const outputLength = summary?.output?.length || 0;
    return (((inputLength - outputLength) / inputLength) * 100).toFixed(2);
  };

  useEffect(() => {
    setAuthUser();
    fetchSummary();
    socket.on("summary", (val) => {
      setSummaries((prev) => [val, ...prev]);
    });
    const update = () => setIsConnected(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      socket.off("summary");
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Live Activity Feed</h2>
        <div className="flex items-center gap-2">
          <Badge
            variant={isConnected ? "secondary" : "destructive"}
            className="flex items-center gap-1"
          >
            {isConnected ? (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <Wifi className="h-3 w-3" />
                Live
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs font-normal pt-0">
                  {user.token} token left
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setModal(true)}>
                  <CoinsIcon /> Purchase Token
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => purchaseHistory()}>
                  <ReceiptTextIcon /> Purchase History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <UserIcon />
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground h-8">
        <span>
          {summaries.length} of{" "}
          {total < summaries.length ? summaries.length : total} summaries
        </span>
      </div>

      <div className="space-y-4">
        {summaries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">No summaries yet</div>
            </CardContent>
          </Card>
        ) : (
          summaries.map((summary, i) => (
            <Card key={i} className="transition-all hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={summary.user.avatar} />
                      <AvatarFallback>{summary.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {summary.user.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      <TrendingDown className="h-3 w-3" />
                      {getCompression(summary)}% compressed
                    </Badge>
                    {new Date(summary.createdAt).getTime() >
                      Date.now() - 30000 && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(summary.createdAt)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">
                      Summary:
                    </p>
                    <p className="text-sm">{summary.output}</p>
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                      View original text ({summary.input.length} characters)
                    </summary>
                    <div className="mt-2 p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {summary.input}
                      </p>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <div className="flex justify-center">
          {init && summaries.length === 0 && summaries.length < total && (
            <Button variant="outline" onClick={fetchSummary} disabled={loading}>
              {loading && <Loader2Icon className="animate-spin" />} Load More
            </Button>
          )}
        </div>
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogTitle></DialogTitle>
        <DialogContent className="w-full !max-w-5xl max-h-[85vh] overflow-y-auto">
          <div className="mx-auto">
            <div className="text-center">
              <h2 className="text-slate-900 text-3xl font-bold mb-4">
                Choose the right plan for you
              </h2>
              <p className="text-[15px] text-slate-600">
                Flexible plans designed for individuals, teams, and growing
                businesses.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-12 max-sm:max-w-sm max-sm:mx-auto">
              <div className="border border-gray-300 shadow-sm rounded-md p-6">
                <h3 className="text-slate-900 text-xl font-semibold mb-3">
                  Starter
                </h3>
                <p className="text-[15px] text-slate-600">
                  For Individuals and Small Teams
                </p>

                <div className="mt-8">
                  <h3 className="text-slate-900 text-3xl font-semibold">
                    $10{" "}
                    <sub className="text-slate-600 text-[15px] font-normal">
                      / 10 tokens
                    </sub>
                  </h3>
                </div>

                <div className="mt-6">
                  <h4 className="text-slate-900 text-lg font-semibold mb-3">
                    Include
                  </h4>
                  <p className="text-[15px] text-slate-600">
                    Everything you get in this plan
                  </p>

                  <ul className="mt-8 space-y-4">
                    {features.map((feature, i) => (
                      <li
                        className="flex items-center text-[15px] text-slate-600 font-medium"
                        key={i}
                      >
                        <CheckIcon className="text-green-600 mr-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    variant="green"
                    className="w-full mt-5"
                    onClick={() => purchasePlan(10)}
                    disabled={priceLoading === 10}
                  >
                    {priceLoading === 10 && (
                      <Loader2Icon className="animate-spin" />
                    )}
                    Purchase Plan
                  </Button>
                </div>
              </div>

              <div className="border border-green-600 shadow-sm rounded-md p-6">
                <h3 className="text-slate-900 text-xl font-semibold mb-3 flex items-center">
                  Professional{" "}
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-md ml-3">
                    Best Deal
                  </span>
                </h3>
                <p className="text-[15px] text-slate-600">
                  For Individuals and Largest Teams
                </p>

                <div className="mt-8">
                  <h3 className="text-slate-900 text-3xl font-semibold">
                    $20{" "}
                    <sub className="text-slate-600 text-[15px] font-normal">
                      / 20 tokens
                    </sub>
                  </h3>
                </div>

                <div className="mt-6">
                  <h4 className="text-slate-900 text-lg font-semibold mb-3">
                    Include
                  </h4>
                  <p className="text-[15px] text-slate-600">
                    Everything you get in this plan
                  </p>

                  <ul className="mt-8 space-y-4">
                    {features.map((feature, index) => (
                      <li
                        className="flex items-center text-[15px] text-slate-600 font-medium"
                        key={index}
                      >
                        <CheckIcon className="text-green-600 mr-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    variant="green"
                    className="w-full mt-5"
                    onClick={() => purchasePlan(20)}
                    disabled={priceLoading === 20}
                  >
                    {priceLoading === 20 && (
                      <Loader2Icon className="animate-spin" />
                    )}
                    Purchase Plan
                  </Button>
                </div>
              </div>

              <div className="border border-gray-300 shadow-sm rounded-md p-6">
                <h3 className="text-slate-900 text-xl font-semibold mb-3">
                  Business
                </h3>
                <p className="text-[15px] text-slate-600">
                  For Multiples and Largest Teams
                </p>

                <div className="mt-8">
                  <h3 className="text-slate-900 text-3xl font-semibold">
                    $100{" "}
                    <sub className="text-slate-600 text-[15px] font-normal">
                      / 100 tokens
                    </sub>
                  </h3>
                </div>

                <div className="mt-6">
                  <h4 className="text-slate-900 text-lg font-semibold mb-3">
                    Include
                  </h4>
                  <p className="text-[15px] text-slate-600">
                    Everything you get in this plan
                  </p>

                  <ul className="mt-8 space-y-4">
                    {features.map((feature, index) => (
                      <li
                        className="flex items-center text-[15px] text-slate-600 font-medium"
                        key={index}
                      >
                        <CheckIcon className="text-green-600 mr-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    variant="green"
                    className="w-full mt-5"
                    onClick={() => purchasePlan(100)}
                    disabled={priceLoading === 100}
                  >
                    {priceLoading === 100 && (
                      <Loader2Icon className="animate-spin" />
                    )}
                    Purchase Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

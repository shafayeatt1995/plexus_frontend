"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  User,
  TrendingDown,
  Search,
  RefreshCw,
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
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import api from "../server/apiFetch";

export function ActivityFeed({ onRefresh, lastUpdate }) {
  const [isConnected, setIsConnected] = useState(true);
  const [summaries, setSummaries] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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
      (now.getTime() - date.getTime()) / (1000 * 60)
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
      console.log(data);
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setPriceLoading(null);
    }
  };
  const purchaseHistory = () => {
    router.push("/purchase-history");
  };

  useEffect(() => {
    setAuthUser();
    const update = () => setIsConnected(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div className="space-y-6">
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
          <Button variant="outline" size="sm" disabled={!isConnected}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setModal(true)}>
                  <CoinsIcon /> Purchase Plan
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

      {lastUpdate && (
        <div className="text-xs text-muted-foreground">
          Last updated: {formatTimeAgo(lastUpdate)}
        </div>
      )}

      <div className="flex flex-row gap-2 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search summaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="compression">Best compression</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground h-8">
        <span>10 of 100 summaries</span>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
            Clear search
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {summaries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {search
                  ? "No summaries match your filters"
                  : "No summaries yet"}
              </div>
              {search && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => setSearch("")}
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          summaries.map((summary, index) => (
            <Card
              key={summary.id}
              className={`transition-all hover:shadow-lg ${
                index === 0 && summary.timestamp.getTime() > Date.now() - 5000
                  ? "ring-2 ring-primary/20"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{summary.user}</span>
                    {summary.compressionRatio && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <TrendingDown className="h-3 w-3" />
                        {summary.compressionRatio}% compressed
                      </Badge>
                    )}
                    {summary.timestamp.getTime() > Date.now() - 30000 && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(summary.timestamp)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">
                      Summary:
                    </p>
                    <p className="text-sm">{summary.summary}</p>
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                      View original text ({summary.originalText.length}{" "}
                      characters)
                    </summary>
                    <div className="mt-2 p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {summary.originalText}
                      </p>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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
                      / per month
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
                      / per month
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
                      / per month
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

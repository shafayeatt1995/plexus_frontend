export const dynamic = "force-dynamic";

import { CoinsIcon, Undo2Icon } from "lucide-react";
import Header from "../../components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import api from "../../server/apiFetch";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/button";
import Link from "next/link";

export default async function PurchaseHistory() {
  let items = [];

  try {
    const response = await api.get("/user/purchase-history");
    items = response.items;
  } catch (error) {
    console.error(error);
  }
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-3xl">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          <Undo2Icon />
          Back to Home
        </Link>
        <h1 className="text-3xl font-semibold mb-2 mt-4">Purchase History</h1>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.plan}</TableCell>
                  <TableCell>${item.amount / 100}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <CoinsIcon size={14} /> {item.token}
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

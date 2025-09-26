import { Poppins } from "next/font/google";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Plexus Cloud AI",
  description: "Plexus Cloud AI",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="hydrated">
      <body className={`${font.className}  antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

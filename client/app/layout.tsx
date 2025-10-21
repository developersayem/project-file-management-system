"use client";

// import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";

// export const metadata: Metadata = {
//   title: "Leads Directory",
//   description: " ",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <main>
          <CartProvider> {children}</CartProvider>
        </main>
      </body>
    </html>
  );
}

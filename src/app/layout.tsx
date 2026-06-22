import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: {
    default: "StemVault — Premium Music Stems Marketplace",
    template: "%s | StemVault",
  },
  description:
    "Browse, preview, and download premium music stems from top producers. Powered by secure Paystack payments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="relative min-h-screen overflow-x-hidden flex flex-col justify-between">
              {/* Background Liquid Glass organic blobs */}
              <div className="fluid-blobs">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
              </div>
              
              <Navbar />
              <div className="flex-grow z-10">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
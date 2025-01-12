"use client";

import type { Metadata } from "next";
import { Josefin_Sans, Poppins } from "next/font/google";
import "./globals.scss";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/redux/provider";
import { useLoadUserQuery } from "@/redux/api/apiSlice";
import InfinityLoader from "@/components/ui/loader";
import { usePathname } from "next/navigation";
import SaleHeader from "@/components/SaleHeader";
import Footer from "@/components/Footer";

const geistJosefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistPoppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistJosefin.variable} ${geistPoppins.variable} antialiased min-h-screen bg-off-white`}
        suppressHydrationWarning
      >
        <StoreProvider>
          {pathname?.includes("/admin") ? null : <SaleHeader />}

          {pathname?.includes("/admin") ||
          pathname?.includes("/search") ? null : (
            <Header />
          )}

          {children}

          {pathname?.includes("/admin") ? null : <Footer />}

          <Toaster
            richColors
            closeButton
            theme="light"
          />
        </StoreProvider>
      </body>
    </html>
  );
}
const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  console.log("isLoading: ", isLoading);

  return (
    <>
      {isLoading ? (
        <div className="h-[85vh]">
          <InfinityLoader />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

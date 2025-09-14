import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/redux/provider";
import type { Metadata } from "next";
import { Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "E-Com",
  description: "E-Commerce Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistJosefin.variable} ${geistPoppins.variable} antialiased min-h-screen bg-off-white`}
        suppressHydrationWarning
      >
        <StoreProvider>
          {/* {pathname?.includes("/admin") ? null : <SaleHeader />}

          {pathname?.includes("/admin") ||
          pathname?.includes("/search") ? null : (
            <Header />
          )} */}

          {children}

          {/* {pathname?.includes("/admin") ? null : <Footer />} */}

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
// const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isLoading } = useLoadUserQuery({});
//   console.log("isLoading: ", isLoading);

//   return (
//     <>
//       {isLoading ? (
//         <div className="h-[85vh]">
//           <InfinityLoader />
//         </div>
//       ) : (
//         <>{children}</>
//       )}
//     </>
//   );
// };

import "~/styles/globals.css";

// import { Inter as FontSans } from "next/font/google";
import { GeistSans as FontSans } from "geist/font/sans";

import Navbar from "~/components/navbar";
import { ThemeProvider } from "~/components/theme-provider";
import { validateRequest } from "~/lib/auth/lucia";
import { cn } from "~/lib/utils";

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  return (
    <html lang="en">
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          // fontSans.variable,
          FontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar user={user} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

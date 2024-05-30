import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const font = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Litestore | Cloud-based file storage",
  description: "Lite-weight cloud-based file storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="title" content="Litestore" key="title" />
        <meta
          name="description"
          content="Lite-weight cloud-based file storage."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://litestore.stamtsag.com/" />
        <meta property="og:title" content="Litestore" />
        <meta
          property="og:description"
          content="Lite-weight cloud-based file storage."
        />
        <meta
          property="og:image"
          content="https://litestore.stamtsag.com/embed.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://litestore.stamtsag.com/"
        />
        <meta property="twitter:title" content="Litestore" />
        <meta
          property="twitter:description"
          content="Lite-weight cloud-based file storage."
        />
        <meta
          property="twitter:image"
          content="https://litestore.stamtsag.com/embed.png"
        />
      </head>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

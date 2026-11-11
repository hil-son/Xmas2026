import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@theme";
import ClientModalProvider from "@components/providers/ClientModalProvider";
import "@styles/global.scss";
import "@styles/reset.scss";
import "@styles/reset-button.scss";

const allRoundGothic = localFont({
  src: [
    {
      path: "../fonts/AllRoundGothic-Medium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AllRoundGothic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AllRoundGothic-Medium.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-allround-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={allRoundGothic.variable}>
      <body className={allRoundGothic.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ClientModalProvider>{children}</ClientModalProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

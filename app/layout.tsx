import { Unbounded } from "next/font/google";
import "./globals.css";
import { A1AppWithProviders } from "@/components/A1AppWithProviders";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "A1 Agent",
  description: "Trade,Automate,Allocate and Analyze",
};

const pacifico = Unbounded({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pacifico.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <A1AppWithProviders> {children} </A1AppWithProviders>
        </main>
      </body>
    </html>
  );
}

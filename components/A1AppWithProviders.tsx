"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/wagmi/wagmiConfig";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";
import { ThemeProvider } from "next-themes";

const A1App = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-full max-w-[430px] min-h-screen">
        <main className="relative flex flex-col flex-1">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const A1AppWithProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base} // add baseSepolia for testing
        config={{
          appearance: {
            name: "asset", // Displayed in modal header
            mode: "auto", // 'light' | 'dark' | 'auto'
            theme: "default", // 'default' or custom theme
          },
          wallet: {
            display: "modal",
            termsUrl: "https://...",
            privacyUrl: "https://...",
          },
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ProgressBar height="3px" color="#2299dd" />
            <A1App>{children}</A1App>
          </QueryClientProvider>
        </WagmiProvider>
      </OnchainKitProvider>
    </ThemeProvider>
  );
};

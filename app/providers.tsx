"use client";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { config } from "./config/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { NextUIProvider } from "@nextui-org/react";

type Props = {
  children: React.ReactNode;
};

export const ariseChain = {
  id: 4833,
  name: "Arise Testnet",
  network: "arisetestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Arise",
    symbol: "Arise",
  },
  rpcUrls: {
    public: {
      http: ["https://aster-rpc-nonprd.arisetech.dev"],
    },
    default: {
      http: ["https://aster-rpc-nonprd.arisetech.dev"],
    },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ariseChain],
  [publicProvider()]
);

const demoAppInfo = {
  appName: "Web3 Dive In",
};

const connectors = connectorsForWallets([
  {
    groupName: "Metamask",
    wallets: [metaMaskWallet({ projectId: "", chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

export default function Providers({ children }: Props) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
            {children}
          </RainbowKitProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

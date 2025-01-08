import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BakoSafeConnector,
  createConfig as createFuelConfig,
  FueletWalletConnector,
  FuelWalletConnector,
  SolanaConnector,
  WalletConnectConnector,
  BurnerWalletConnector,
} from "@fuels/connectors";
import { FuelProvider } from "@fuels/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, CHAIN_IDS } from "fuels";
import { MAINNET_PROVIDER_URL, TESTNET_PROVIDER_URL } from "./constants.ts";
import { createConfig, http, injected } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { walletConnect } from "@wagmi/connectors";
import type { Config as WagmiConfig } from "@wagmi/core";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

// Support both mainnet and testnet
const networks = [
  {
    chainId: CHAIN_IDS.fuel.mainnet,
    url: MAINNET_PROVIDER_URL,
  },
  {
    chainId: CHAIN_IDS.fuel.testnet,
    url: TESTNET_PROVIDER_URL,
  }
];

const FUEL_CONFIG = createFuelConfig(() => {
  const WalletConnectProjectId = "35b967d8f17700b2de24f0abee77e579";
  const wagmiConfig = createConfig({
    syncConnectedChain: false,
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    connectors: [
      injected({ shimDisconnect: false }),
      walletConnect({
        projectId: WalletConnectProjectId,
        metadata: {
          name: "AI Story",
          description: "AI Story on the Fuel network.",
          url: "https://aistory.xyz/",
          icons: ["https://connectors.fuel.network/logo_white.png"],
        },
      }),
    ],
  });

  // Create providers for both networks
  const mainnetProvider = Provider.create(MAINNET_PROVIDER_URL);
  const testnetProvider = Provider.create(TESTNET_PROVIDER_URL);

  // Default to testnet for initial connection
  const defaultProvider = testnetProvider;

  const fueletWalletConnector = new FueletWalletConnector();
  const fuelWalletConnector = new FuelWalletConnector();
  const bakoSafeConnector = new BakoSafeConnector();
  const burnerWalletConnector = new BurnerWalletConnector({ fuelProvider: defaultProvider });
  const walletConnectConnector = new WalletConnectConnector({
    projectId: WalletConnectProjectId,
    wagmiConfig: wagmiConfig as WagmiConfig,
    chainId: CHAIN_IDS.fuel.testnet,
    fuelProvider: defaultProvider,
  });
  const solanaConnector = new SolanaConnector({
    projectId: WalletConnectProjectId,
    chainId: CHAIN_IDS.fuel.testnet,
    fuelProvider: defaultProvider,
  });
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /(iphone|android|windows phone)/.test(userAgent);

  return {
    connectors: [
      fueletWalletConnector,
      walletConnectConnector,
      solanaConnector,
      burnerWalletConnector,
      ...(isMobile ? [] : [fuelWalletConnector, bakoSafeConnector]),
    ],
  };
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        networks={networks}
        fuelConfig={FUEL_CONFIG}
        uiConfig={{ suggestBridge: false }}
        theme="dark"
      >
        <App />
      </FuelProvider>
    </QueryClientProvider>
  </StrictMode>,
);

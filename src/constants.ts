// Network Configuration
export const TESTNET_PROVIDER_URL = "https://testnet.fuel.network/v1/graphql";
export const MAINNET_PROVIDER_URL = "https://mainnet.fuel.network/graphql";

// Payment Configuration
export const MIN_PAYMENT_AMOUNT = 0.1;
export const TIME_PER_PAYMENT = 3600; // 1 hour in seconds

// Language Configuration
export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

// OpenAI Configuration
export const OPENAI_MODEL = "gpt-3.5-turbo";
export const MAX_TOKENS = 800;
export const TEMPERATURE = 0.8;

// Wallet Configuration
export const WALLET_CONNECT_PROJECT_ID = "35b967d8f17700b2de24f0abee77e579";
export const METADATA = {
  name: "AI Story",
  description: "AI Story on the Fuel network.",
  url: "https://aistory.xyz/",
  icons: ["https://connectors.fuel.network/logo_white.png"],
};

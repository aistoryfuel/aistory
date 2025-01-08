import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_OPENAI_API_KEY: JSON.stringify(process.env.VITE_OPENAI_API_KEY),
      VITE_AI_WALLET_PRIVATE_KEY: JSON.stringify(process.env.VITE_AI_WALLET_PRIVATE_KEY),
      VITE_AI_WALLET_ADDRESS: JSON.stringify(process.env.VITE_AI_WALLET_ADDRESS),
      VITE_REWARD_ASSET_ID: JSON.stringify(process.env.VITE_REWARD_ASSET_ID),
      VITE_IS_TESTNET: JSON.stringify(process.env.VITE_IS_TESTNET)
    }
  }
});

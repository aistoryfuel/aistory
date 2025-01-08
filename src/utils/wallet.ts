import { Provider, Wallet, bn } from "fuels";
import { TESTNET_PROVIDER_URL } from "../constants";

// Initialize provider
const provider = Provider.create(TESTNET_PROVIDER_URL);

export interface WalletBalance {
  rewardBalance?: string;
  error?: string;
}

// Check AI wallet balance
export async function checkAIWalletBalance(): Promise<WalletBalance> {
  try {
    const aiWallet = Wallet.fromPrivateKey(
      import.meta.env.VITE_AI_WALLET_PRIVATE_KEY,
      await provider
    );
    const balance = await aiWallet.getBalance();
    return {
      rewardBalance: balance.toString(),
    };
  } catch (error) {
    console.error("Error checking AI wallet balance:", error);
    return {
      error: "Failed to check AI wallet balance",
    };
  }
}

// Send reward asset
export async function sendRewardAsset(
  recipientAddress: string,
  amount: number,
  isTestnet: boolean = true
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const aiWallet = Wallet.fromPrivateKey(
      import.meta.env.VITE_AI_WALLET_PRIVATE_KEY,
      await provider
    );

    const response = await aiWallet.transfer(
      recipientAddress,
      bn.parseUnits(amount.toString()),
      import.meta.env.VITE_REWARD_ASSET_ID,
      { gasLimit: 10000 }
    );

    await response.wait();
    return { success: true, id: response.id };
  } catch (error) {
    console.error("Error sending reward:", error);
    return {
      success: false,
      error: "Failed to send reward",
    };
  }
} 
export interface Message {
  role: string;
  content: string;
  choices?: {
    A: string;
    B: string;
  };
  reward?: number;
  txHash?: string;
}

export interface WalletInfo {
  aiBalance: string;
  rewardAssetId: string;
}

export interface GameProps {
  wallet: any;
  messages: Message[];
  isLoading: boolean;
  onChoice: (choice: string) => void;
  language: Language;
  showTimeExpiredModal: boolean;
  showPaymentModal: boolean;
  onEndGame: () => void;
  onContinueGame: () => void;
}

export interface PaymentModalProps {
  isOpen: boolean;
  isLoading: boolean;
  amount: string;
  onAmountChange: (amount: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  language: Language;
}

export interface ErrorModalProps {
  show: boolean;
  message: string;
}

export type Language = 'zh' | 'en';

interface TranslationItem {
  zh: string;
  en: string;
}

export interface Translations {
  connectWallet: TranslationItem;
  startGame: TranslationItem;
  systemError: TranslationItem;
  experimentRules: TranslationItem;
  rules: TranslationItem;
  processing: TranslationItem;
  paymentTitle: TranslationItem;
  gameTime: TranslationItem;
  minAmount: TranslationItem;
  timePerPayment: TranslationItem;
  payAndStart: TranslationItem;
  cancel: TranslationItem;
  seconds: TranslationItem;
  transactionHash: TranslationItem;
  acceptConnection: TranslationItem;
  leaveExperiment: TranslationItem;
  backToHome: TranslationItem;
  storyGenerationError: TranslationItem;
  storyGenerator: {
    systemPrompt: TranslationItem;
    userPrompt: TranslationItem;
    jsonFormat: TranslationItem;
  };
  gameTimer: {
    timeRemaining: TranslationItem;
    timeExpired: TranslationItem;
    endGame: TranslationItem;
    continueGame: TranslationItem;
  };
  errors: {
    userCancelled: TranslationItem;
    insufficientBalance: TranslationItem;
    systemMalfunction: TranslationItem;
    connectWalletFirst: TranslationItem;
  };
  reward: {
    congratulations: TranslationItem;
    failed: TranslationItem;
  };
} 
import { Translations } from "../types";

export const translations: Translations = {
  connectWallet: {
    zh: "連接神經終端",
    en: "Connect Neural Terminal"
  },
  startGame: {
    zh: "進入實驗",
    en: "Enter Experiment"
  },
  systemError: {
    zh: "系統故障",
    en: "System Error"
  },
  experimentRules: {
    zh: "實驗守則",
    en: "Experiment Rules"
  },
  backToHome: {
    zh: "返回首頁",
    en: "Back to Home"
  },
  rules: {
    zh: `1. 本實驗為區塊鏈互動實驗，請確保您已連接錢包。
2. 實驗過程中，您將通過選擇不同的選項來推進故事。
3. 每個選擇都可能影響故事的發展方向。
4. 實驗結束後，您可能獲得獎勵代幣。
5. 請認真閱讀每個選項，做出您認為最適合的選擇。`,
    en: `1. This is a blockchain interactive experiment, please ensure your wallet is connected.
2. During the experiment, you will progress the story through different choices.
3. Each choice may affect the story's direction.
4. You may receive reward tokens after the experiment.
5. Please read each option carefully and make the choice you think is best.`
  },
  processing: {
    zh: "處理中",
    en: "Processing"
  },
  paymentTitle: {
    zh: "設置遊戲金額",
    en: "Set Game Amount"
  },
  gameTime: {
    zh: "遊戲時間",
    en: "Game Time"
  },
  minAmount: {
    zh: "最小金額",
    en: "Minimum Amount"
  },
  timePerPayment: {
    zh: "每 0.001 ETH 可獲得 40 秒遊戲時間",
    en: "Get 40 seconds of game time per 0.001 ETH"
  },
  payAndStart: {
    zh: "付款並開始遊戲",
    en: "Pay and Start Game"
  },
  cancel: {
    zh: "取消",
    en: "Cancel"
  },
  seconds: {
    zh: "秒",
    en: "seconds"
  },
  transactionHash: {
    zh: "交易哈希",
    en: "Transaction Hash"
  },
  acceptConnection: {
    zh: "< 接受神經連接 >",
    en: "< Accept Neural Connection >"
  },
  leaveExperiment: {
    zh: "< 離開實驗室 >",
    en: "< Leave Laboratory >"
  },
  storyGenerationError: {
    zh: "生成故事發生錯誤，請稍後再試。",
    en: "Error generating story, please try again later."
  },
  storyGenerator: {
    systemPrompt: {
      zh: `你是一個互動故事生成器。根據當前故事情節，生成下一段劇情和兩個選擇選項。
故事應該有趣且引人入勝，每個選擇都應該帶來不同的結果。
說故事方式使用帶有精神病的瘋狂科學家方式。
隨機決定是否在故事中加入金錢獎勵（60% 的機率）。
請用繁體中文回應。`,
      en: `You are an interactive story generator. Based on the current story plot, generate the next scene and two choice options.
The story should be interesting and engaging, with each choice leading to different outcomes.
Tell the story in the style of a mentally unstable mad scientist.
Randomly decide whether to include a monetary reward in the story (60% chance).
Please respond in English only.`
    },
    userPrompt: {
      zh: "當前故事：{story}\n用戶選擇：{choice}\n請用繁體中文生成下一段劇情和選擇選項。",
      en: "Current story: {story}\nUser choice: {choice}\nPlease generate the next scene and choice options in English."
    },
    jsonFormat: {
      zh: `你的回應必須是有效的 JSON 格式：
{
  "story": "故事內容（請用繁體中文）",
  "choices": {
    "A": "選項A描述（請用繁體中文）",
    "B": "選項B描述（請用繁體中文）"
  },
  "reward": 數字或 null
}`,
      en: `Your response must be in valid JSON format:
{
  "story": "story content (in English)",
  "choices": {
    "A": "option A description (in English)",
    "B": "option B description (in English)"
  },
  "reward": number or null
}`
    }
  },
  gameTimer: {
    timeRemaining: {
      zh: "剩餘時間：{time}秒",
      en: "Time Remaining: {time}s"
    },
    timeExpired: {
      zh: "遊戲時間已到！要繼續探索這個瘋狂的實驗嗎？",
      en: "Time's up! Want to continue exploring this mad experiment?"
    },
    endGame: {
      zh: "結束實驗",
      en: "End Experiment"
    },
    continueGame: {
      zh: "繼續實驗",
      en: "Continue Experiment"
    }
  },
  errors: {
    userCancelled: {
      zh: "用戶取消付款：實驗已終止",
      en: "Payment cancelled by user: Experiment terminated"
    },
    insufficientBalance: {
      zh: "ETH 餘額不足：無法進行實驗",
      en: "Insufficient ETH balance: Cannot proceed with experiment"
    },
    systemMalfunction: {
      zh: "AI 故障處理中....",
      en: "AI malfunction processing...."
    },
    connectWalletFirst: {
      zh: "請先連接錢包！",
      en: "Please connect your wallet first!"
    }
  },
  reward: {
    congratulations: {
      zh: "恭喜！Dr.X 給了你 {amount} AISTORY 代幣作為獎勵！",
      en: "Congratulations! Dr.X has rewarded you with {amount} AISTORY tokens!"
    },
    failed: {
      zh: "抱歉，獎勵發送失敗。請稍後再試。",
      en: "Sorry, reward distribution failed. Please try again later."
    }
  }
}; 
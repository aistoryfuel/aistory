import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@fuel-ui/react";
import { useWallet, useConnectUI, useDisconnect } from "@fuels/react";
import { sendRewardAsset, checkAIWalletBalance } from "../../utils/wallet";
import OpenAI from 'openai';
import { bn, Wallet, Provider } from "fuels";
import { TESTNET_PROVIDER_URL } from "../../constants";
import { GameInterface } from "./components/GameInterface";
import { PaymentModal } from "./components/PaymentModal";
import { ErrorModal } from "./components/ErrorModal";
import { Message, WalletInfo, Language } from "./types";
import { FIRST_STORY, MIN_PAYMENT_AMOUNT, TIME_PER_PAYMENT } from "./constants";
import { translations } from "./constants/translations";
import { animations } from "./styles/animations";

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(MIN_PAYMENT_AMOUNT.toString());
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{show: boolean, message: string}>({
    show: false,
    message: ""
  });
  const [language, setLanguage] = useState<Language>('zh');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showTimeExpiredModal, setShowTimeExpiredModal] = useState(false);
  
  const { wallet } = useWallet();
  const { connect } = useConnectUI();
  const { disconnect } = useDisconnect();

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 處理錢包連接/斷開
  const handleWalletConnection = async () => {
    if (wallet) {
      await disconnect();
      setGameStarted(false);
      setMessages([]);
    } else {
      await connect();
    }
  };

  // 切換語言
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
    if (!gameStarted) {
      // 只有在遊戲未開始時才重置狀態
      setMessages([]);
      setShowPaymentModal(false);
      setErrorModal({
        show: false,
        message: ""
      });
    }
  };

  // 在組件加載時檢查 AI 錢包餘額
  useEffect(() => {
    const checkBalance = async () => {
      try {
        const balance = await checkAIWalletBalance();
        setWalletInfo({
          aiBalance: balance.rewardBalance?.toString() || "0",
          rewardAssetId: import.meta.env.VITE_REWARD_ASSET_ID
        });
      } catch (error) {
        console.error("Error checking AI wallet balance:", error);
      }
    };
    checkBalance();
  }, [wallet]);

  const startGame = () => {
    if (!wallet) {
      setErrorModal({
        show: true,
        message: translations.errors.connectWalletFirst[language]
      });
      setTimeout(() => {
        setErrorModal({
          show: false,
          message: ""
        });
      }, 1000);
      return;
    }
    console.log('Starting game...');
    console.log('Initial story:', FIRST_STORY[language]);
    setGameStarted(true);
    setMessages([FIRST_STORY[language]]);
    console.log('Messages set:', [FIRST_STORY[language]]);
  };

  const generateNextStory = async (currentStory: string, userChoice: string) => {
    try {
      const systemPrompt = `${translations.storyGenerator.systemPrompt[language]}\n${translations.storyGenerator.jsonFormat[language]}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: translations.storyGenerator.userPrompt[language]
              .replace('{story}', currentStory)
              .replace('{choice}', userChoice)
          }
        ],
        temperature: 0.8,
        max_tokens: 800,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(aiResponse);
      
      if (!parsedResponse.story || !parsedResponse.choices || !parsedResponse.choices.A || !parsedResponse.choices.B) {
        throw new Error('Invalid response format');
      }

      return {
        role: "assistant",
        content: parsedResponse.story,
        choices: parsedResponse.choices,
        reward: parsedResponse.reward || null
      };
    } catch (error) {
      console.error('Story generation error:', error);
      throw error;
    }
  };

  const handleChoice = async (choice: string) => {
    console.log('Choice selected:', choice);
    if (isLoading) return;
    setIsLoading(true);

    const currentMessage = messages[messages.length - 1];
    console.log('Current message:', currentMessage);
    
    try {
      // 處理語言變化
      if (choice === 'LANGUAGE_CHANGE') {
        setMessages(prev => {
          const updatedMessages = [...prev];
          updatedMessages[0] = {
            ...FIRST_STORY[language],
            choices: {
              A: translations.acceptConnection[language],
              B: translations.leaveExperiment[language]
            }
          };
          return updatedMessages;
        });
        setIsLoading(false);
        return;
      }

      if (choice === translations.leaveExperiment[language]) {
        console.log('User chose to leave experiment');
        setGameStarted(false);
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // 添加用戶選擇到消息列表
      setMessages(prev => [...prev, { role: "user", content: choice }]);

      if (messages.length === 1 && choice === translations.acceptConnection[language]) {
        console.log('User accepted connection, showing payment modal');
        setShowPaymentModal(true);
        setIsLoading(false);
        return;
      }

      // 如果不是特殊選項，則生成下一個故事
      console.log('Generating next story for choice:', choice);
      const nextMessage = await generateNextStory(currentMessage.content, choice);
      console.log('Generated next message:', nextMessage);
      
      if (nextMessage.reward && wallet?.address) {
        try {
          console.log('Sending reward to user');
          const response = await sendRewardAsset(
            wallet.address.toString(),
            nextMessage.reward,
            true
          );
          
          setMessages(prev => [
            ...prev,
            {
              role: "system",
              content: translations.reward.congratulations[language].replace('{amount}', nextMessage.reward?.toString() || '0'),
              txHash: response.id
            },
            nextMessage
          ]);
        } catch (error) {
          console.error("Failed to send reward:", error);
          setMessages(prev => [
            ...prev,
            {
              role: "system",
              content: translations.reward.failed[language],
            },
            nextMessage
          ]);
        }
      } else {
        setMessages(prev => [...prev, nextMessage]);
      }
    } catch (error) {
      console.error("Error handling choice:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "system",
          content: translations.storyGenerationError[language],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 計算遊戲時間
  const calculateGameTime = (amount: string) => {
    const ethAmount = parseFloat(amount);
    if (isNaN(ethAmount)) return TIME_PER_PAYMENT;
    return Math.floor(ethAmount / MIN_PAYMENT_AMOUNT) * TIME_PER_PAYMENT;
  };

  // 處理遊戲時間
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (timeRemaining !== null && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (timer) clearInterval(timer);
            setShowTimeExpiredModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining]);

  // 處理付款成功
  const handlePayment = async () => {
    if (!wallet) return;
    
    try {
      setIsPaymentLoading(true);

      const AI_WALLET_PRIVATE_KEY = import.meta.env.VITE_AI_WALLET_PRIVATE_KEY?.toString().replace('0x', '') || "";
      
      if (!AI_WALLET_PRIVATE_KEY) {
        throw new Error("AI_ERROR");
      }

      const provider = await Provider.create(TESTNET_PROVIDER_URL);
      const aiWallet = Wallet.fromPrivateKey(AI_WALLET_PRIVATE_KEY, provider);
      
      const amount = bn.parseUnits(paymentAmount);
      
      try {
        const transactionRequest = await wallet.createTransfer(aiWallet.address, amount);
        const response = await wallet.sendTransaction(transactionRequest);
        await response.wait();
        
        setIsPaymentLoading(false);
        setShowPaymentModal(false);

        // 更新遊戲時間
        const gameTime = calculateGameTime(paymentAmount);
        setTimeRemaining(gameTime);

        // 生成第一個故事回應
        console.log('Generating first story response after payment');
        const currentMessage = messages[messages.length - 1];
        const nextMessage = await generateNextStory(
          currentMessage.content, 
          translations.acceptConnection[language]
        );
        console.log('Generated first story response:', nextMessage);
        
        setMessages(prev => [...prev, nextMessage]);

      } catch (addressError: any) {
        console.error("Transaction failed:", addressError);
        
        if (addressError.message?.includes('User rejected the transaction') || 
            addressError.code === 4001 ||
            addressError.message?.includes('User denied')) {
          setErrorModal({
            show: true,
            message: translations.errors.userCancelled[language]
          });
        } else if (addressError.message?.includes('insufficient') || 
                  addressError.message?.includes('balance')) {
          setErrorModal({
            show: true,
            message: translations.errors.insufficientBalance[language]
          });
        } else {
          setErrorModal({
            show: true,
            message: translations.errors.systemMalfunction[language]
          });
        }
        throw addressError;
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setIsPaymentLoading(false);
      setShowPaymentModal(false);
      
      setTimeout(() => {
        setErrorModal({ show: false, message: "" });
        if (messages.length === 0) {
          setGameStarted(false);
        }
      }, 2000);
    }
  };

  const handleAmountChange = (amount: string) => {
    const newAmount = parseFloat(amount);
    if (!isNaN(newAmount) && newAmount >= MIN_PAYMENT_AMOUNT) {
      setPaymentAmount(newAmount.toFixed(3));
    } else {
      setPaymentAmount(MIN_PAYMENT_AMOUNT.toString());
    }
  };

  const handleIncreaseAmount = () => {
    const currentAmount = parseFloat(paymentAmount);
    if (!isNaN(currentAmount)) {
      handleAmountChange((currentAmount + MIN_PAYMENT_AMOUNT).toFixed(3));
    }
  };

  const handleDecreaseAmount = () => {
    const currentAmount = parseFloat(paymentAmount);
    if (!isNaN(currentAmount) && currentAmount > MIN_PAYMENT_AMOUNT) {
      handleAmountChange((currentAmount - MIN_PAYMENT_AMOUNT).toFixed(3));
    }
  };

  // 處理結束遊戲
  const handleEndGame = () => {
    setShowTimeExpiredModal(false);
    setGameStarted(false);
    setMessages([]);
    setTimeRemaining(null);
  };

  // 處理繼續遊戲
  const handleContinueGame = () => {
    setShowTimeExpiredModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setErrorModal({
      show: true,
      message: translations.errors.userCancelled[language]
    });
    setTimeout(() => {
      setErrorModal({ show: false, message: "" });
      setGameStarted(false);
      setMessages([]);
    }, 2000);
  };

  return (
    <Box css={{
      width: "100%",
      minHeight: "100vh",
      background: "#000000",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 50% 50%, #001a1a 0%, #000000 100%)",
        opacity: 0.5,
        pointerEvents: "none",
      },
    }}>
      <Flex direction="column" css={{ 
        height: "100vh", 
        width: "100%", 
        maxWidth: "800px", 
        margin: "0 auto",
        background: "#000000",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 50%, #00ffff03 0%, transparent 50%)",
          animation: "pulse 4s ease-in-out infinite",
          pointerEvents: "none",
        },
      }}>
        {/* Header with Language, Timer and Wallet Buttons */}
        <Flex css={{
          padding: "12px 20px",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
          borderBottom: "1px solid #00ffff33",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
          },
        }}>
          {/* Left side - Empty or Timer */}
          {timeRemaining !== null && (
            <Text css={{
              color: "#00ffff",
              fontSize: "16px",
              textShadow: "0 0 8px #00ffff",
              animation: "pulse 2s infinite",
            }}>
              {translations.gameTimer.timeRemaining[language].replace('{time}', timeRemaining.toString())}
            </Text>
          )}

          {/* Right side - All buttons */}
          <Flex css={{ gap: "10px", marginLeft: "auto" }}>
            {gameStarted && (
              <Button
                variant="outlined"
                css={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  color: "#00ffff",
                  border: "1px solid #00ffff",
                  background: "transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#00ffff11",
                  },
                }}
                onClick={() => {
                  setGameStarted(false);
                  setMessages([]);
                  setTimeRemaining(null);
                  setShowPaymentModal(false);
                  setShowTimeExpiredModal(false);
                }}
              >
                {translations.backToHome[language]}
              </Button>
            )}

            <Button
              variant="outlined"
              css={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#00ffff",
                border: "1px solid #00ffff",
                background: "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                "&:hover": {
                  background: "#00ffff11",
                },
              }}
              onClick={toggleLanguage}
            >
              {language === 'zh' ? 'EN' : '中文'}
            </Button>

            <Button
              variant="outlined"
              css={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#00ffff",
                border: "1px solid #00ffff",
                background: "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                textShadow: "0 0 8px #00ffff",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  right: "-2px",
                  bottom: "-2px",
                  background: "linear-gradient(45deg, #00ffff33, transparent, #00ffff33)",
                  zIndex: -1,
                  animation: "borderGlow 2s linear infinite",
                },
                "&:hover": {
                  background: "#00ffff11",
                  textShadow: "0 0 12px #00ffff",
                  "&::after": {
                    opacity: 1,
                  },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "0",
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, #00ffff22, transparent)",
                  opacity: 0,
                  transition: "0.5s",
                  animation: "scanline 2s linear infinite",
                },
              }}
              onClick={handleWalletConnection}
            >
              {wallet ? formatAddress(wallet.address.toString()) : translations.connectWallet[language]}
            </Button>
          </Flex>
        </Flex>

        {!gameStarted ? (
          <Flex
            css={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "40px",
              background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
              padding: "20px",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "1px",
                height: "100px",
                background: "linear-gradient(180deg, #00ffff, transparent)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "1px",
                height: "100px",
                background: "linear-gradient(0deg, #00ffff, transparent)",
              },
            }}
          >
            <Box css={{
              width: "90%",
              maxWidth: "800px",
              padding: "40px",
              border: "1px solid #00ffff33",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #00ffff08, transparent)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #00ffff44, transparent)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #00ffff44, transparent)",
              },
            }}>
              <Text css={{
                color: "#00ffff",
                fontSize: "24px",
                marginBottom: "30px",
                textAlign: "center",
                textShadow: "0 0 8px #00ffff",
              }}>
                {translations.experimentRules[language]}
              </Text>
              <Text css={{
                color: "#fff",
                fontSize: "16px",
                lineHeight: "2",
                textShadow: "0 0 4px #00ffff",
                letterSpacing: "1px",
                whiteSpace: "pre-line",
              }}>
                {translations.rules[language]}
              </Text>
            </Box>

            <Button
              variant="outlined"
              css={{
                padding: "30px 60px",
                fontSize: "24px",
                color: wallet ? "#00ffff" : "#ff0066",
                border: `2px solid ${wallet ? "#00ffff" : "#ff0066"}`,
                background: "transparent",
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden",
                marginTop: "20px",
                cursor: wallet ? "pointer" : "not-allowed",
                filter: wallet ? "none" : "url('#glitch')",
                "&:hover": {
                  background: wallet ? "#00ffff11" : "#ff006611",
                  transform: wallet ? "scale(1.05)" : "scale(1)",
                  "&::after": {
                    opacity: 1,
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  right: "-2px",
                  bottom: "-2px",
                  background: `linear-gradient(45deg, ${
                    wallet ? "#00ffff33" : "#ff006633"
                  }, transparent, ${wallet ? "#00ffff33" : "#ff006633"})`,
                  zIndex: -1,
                  animation: wallet ? "borderGlow 2s linear infinite" : "signalNoise 8s infinite",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "0",
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${
                    wallet ? "#00ffff22" : "#ff006622"
                  }, transparent)`,
                  opacity: 0,
                  transition: "0.5s",
                  animation: "scanline 2s linear infinite",
                },
              }}
              onClick={startGame}
              disabled={!wallet}
            >
              <Text css={{
                position: "relative",
                textShadow: wallet ? "0 0 8px #00ffff" : "0 0 8px #ff0066",
                animation: wallet ? undefined : "signalDistortion 8s infinite",
                letterSpacing: "2px",
              }}>
                {wallet ? translations.startGame[language] : translations.systemError[language]}
              </Text>
            </Button>
          </Flex>
        ) : (
          <GameInterface
            wallet={wallet}
            messages={messages}
            isLoading={isLoading}
            onChoice={handleChoice}
            language={language}
            showTimeExpiredModal={showTimeExpiredModal}
            showPaymentModal={showPaymentModal}
            onEndGame={handleEndGame}
            onContinueGame={handleContinueGame}
          />
        )}

        <ErrorModal show={errorModal.show} message={errorModal.message} />
        
        <PaymentModal
          isOpen={showPaymentModal}
          isLoading={isPaymentLoading}
          amount={paymentAmount}
          onAmountChange={handleAmountChange}
          onConfirm={handlePayment}
          onCancel={handlePaymentCancel}
          onIncrease={handleIncreaseAmount}
          onDecrease={handleDecreaseAmount}
          language={language}
        />

        <style>
          {animations}
        </style>

        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="glitch">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="colormatrix"/>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02 0.004"
                numOctaves="1"
                result="turbulence">
                <animate
                  attributeName="baseFrequency"
                  dur="8s"
                  values="0.02 0.004;0.05 0.015;0.02 0.004"
                  repeatCount="indefinite"/>
              </feTurbulence>
              <feDisplacementMap
                in="colormatrix"
                in2="turbulence"
                scale="3"
                result="displacement"/>
            </filter>
          </defs>
        </svg>

        {/* Time Expired Modal */}
        {showTimeExpiredModal && (
          <Box css={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(135deg, #000000dd, #000000ff)",
            border: "1px solid #00ffff",
            borderRadius: "8px",
            padding: "30px",
            zIndex: 2000,
            textAlign: "center",
            minWidth: "300px",
            backdropFilter: "blur(4px)",
          }}>
            <Text css={{
              color: "#00ffff",
              fontSize: "18px",
              marginBottom: "20px",
              textShadow: "0 0 8px #00ffff",
            }}>
              {translations.gameTimer.timeExpired[language]}
            </Text>
            <Flex css={{ justifyContent: "center", gap: "20px" }}>
              <Button
                variant="outlined"
                css={{
                  padding: "10px 20px",
                  color: "#ff0066",
                  border: "1px solid #ff0066",
                  "&:hover": {
                    background: "#ff006622",
                  },
                }}
                onClick={handleEndGame}
              >
                {translations.gameTimer.endGame[language]}
              </Button>
              <Button
                variant="outlined"
                css={{
                  padding: "10px 20px",
                  color: "#00ffff",
                  border: "1px solid #00ffff",
                  "&:hover": {
                    background: "#00ffff22",
                  },
                }}
                onClick={handleContinueGame}
              >
                {translations.gameTimer.continueGame[language]}
              </Button>
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
} 
import React, { useRef, useEffect } from "react";
import { Box, Button, Flex, Text } from "@fuel-ui/react";
import { GameProps } from "../types";
import { translations } from "../constants/translations";
import { TypewriterText } from "./TypewriterText";
import { FIRST_STORY } from "../constants";

export const GameInterface: React.FC<GameProps> = ({ 
  messages, 
  isLoading, 
  onChoice, 
  language, 
  showTimeExpiredModal,
  showPaymentModal,
  onEndGame, 
  onContinueGame 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('GameInterface messages updated:', messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 監聽語言變化，更新第一條消息
  useEffect(() => {
    if (messages.length > 0 && messages[0].role === 'assistant') {
      const updatedMessages = [...messages];
      updatedMessages[0] = {
        ...FIRST_STORY[language],
        choices: {
          A: translations.acceptConnection[language],
          B: translations.leaveExperiment[language]
        }
      };
      onChoice('LANGUAGE_CHANGE');
    }
  }, [language, messages, onChoice]);

  // 判斷是否應該禁用和模糊界面
  const shouldDisable = showTimeExpiredModal || showPaymentModal;

  return (
    <Box css={{ 
      width: "800px",
      margin: "0 auto",
      padding: "20px",
      background: "#000000",
      position: "relative",
      pointerEvents: shouldDisable ? "none" : "auto",
    }}>
      {/* 歡迎標題 */}
      <Box css={{
        textAlign: "center",
        color: "#00ffff",
        fontSize: "32px",
        fontWeight: "bold",
        textShadow: "0 0 10px #00ffff",
        marginBottom: "10px",
      }}>
        AI Story
      </Box>

      {/* 故事框 */}
      <Box css={{
        background: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        border: "1px solid #00ffff33",
        borderRadius: "10px",
        padding: "20px",
        height: "500px",
        width: "100%",
        overflowY: "auto",
        position: "relative",
        filter: shouldDisable ? "blur(5px)" : "none",
        transition: "filter 0.3s ease",
        pointerEvents: shouldDisable ? "none" : "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#0a0a0a",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#00ffff44",
          borderRadius: "2px",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, #00ffff66, transparent)",
        },
      }}>
        {messages.map((message, index) => {
          console.log(`Rendering message ${index}:`, message);
          return (
            <Box
              key={index}
              css={{
                marginBottom: "16px",
                padding: "15px",
                borderRadius: "8px",
                background: message.role === "assistant"
                  ? "linear-gradient(135deg, #00ffff11, transparent)"
                  : message.role === "system"
                  ? "linear-gradient(135deg, #ff00ff11, transparent)"
                  : "linear-gradient(135deg, #00ffff22, transparent)",
                border: "1px solid #00ffff22",
                fontSize: "16px",
                lineHeight: "1.6",
                position: "relative",
                overflow: "hidden",
                animation: "fadeIn 0.3s ease-out",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #00ffff44, transparent)",
                },
              }}
            >
              <TypewriterText text={message.content} speed={10} />
              {message.txHash && (
                <Box css={{ 
                  marginTop: "10px", 
                  color: "#00ffff",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  padding: "8px",
                  background: "#00ffff0a",
                  border: "1px solid #00ffff22",
                  borderRadius: "4px",
                  wordBreak: "break-all",
                }}>
                  {">>"} {translations.transactionHash[language]}: 
                  <a 
                    href={`https://app${process.env.VITE_IS_TESTNET === "true" ? "-testnet" : ""}.fuel.network/tx/${message.txHash}/simple`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#00ffff",
                      textDecoration: "underline"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.textShadow = "0 0 8px #00ffff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.textShadow = "none";
                    }}
                  >
                    {message.txHash}
                  </a>
                </Box>
              )}
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* 選項按鈕 */}
      {messages[messages.length - 1]?.choices && (
        <Box css={{
          background: "#000000",
          padding: "15px 20px",
          borderTop: "1px solid #00ffff33",
          position: "relative",
          filter: shouldDisable ? "blur(5px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: shouldDisable ? "none" : "auto",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "20px",
            right: "20px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #00ffff44, transparent)",
          },
        }}>
          <Flex 
            direction="column" 
            gap="10px"
          >
            <Button
              variant="outlined"
              css={{
                width: "100%",
                padding: "12px",
                color: shouldDisable ? "#666666" : "#00ffff",
                border: `1px solid ${shouldDisable ? "#666666" : "#00ffff33"}`,
                background: "transparent",
                fontSize: "16px",
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden",
                cursor: shouldDisable ? "not-allowed" : "pointer",
                "&:hover": !shouldDisable ? {
                  background: "#00ffff11",
                  borderColor: "#00ffff",
                  transform: "translateY(-2px)",
                  "&::after": {
                    opacity: 1,
                  },
                } : {},
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
                  animation: shouldDisable ? "none" : "scanline 2s linear infinite",
                },
              }}
              disabled={isLoading || shouldDisable}
              onClick={() => {
                if (!shouldDisable) {
                  console.log('Choice A clicked:', messages[messages.length - 1].choices!.A);
                  onChoice(messages[messages.length - 1].choices!.A);
                }
              }}
            >
              {messages[messages.length - 1].choices!.A}
            </Button>
            <Button
              variant="outlined"
              css={{
                width: "100%",
                padding: "12px",
                color: shouldDisable ? "#666666" : "#00ffff",
                border: `1px solid ${shouldDisable ? "#666666" : "#00ffff33"}`,
                background: "transparent",
                fontSize: "16px",
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden",
                cursor: shouldDisable ? "not-allowed" : "pointer",
                "&:hover": !shouldDisable ? {
                  background: "#00ffff11",
                  borderColor: "#00ffff",
                  transform: "translateY(-2px)",
                  "&::after": {
                    opacity: 1,
                  },
                } : {},
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
                  animation: shouldDisable ? "none" : "scanline 2s linear infinite",
                },
              }}
              disabled={isLoading || shouldDisable}
              onClick={() => {
                if (!shouldDisable) {
                  console.log('Choice B clicked:', messages[messages.length - 1].choices!.B);
                  onChoice(messages[messages.length - 1].choices!.B);
                }
              }}
            >
              {messages[messages.length - 1].choices!.B}
            </Button>
          </Flex>
        </Box>
      )}

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
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
          pointerEvents: "auto",
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
                background: "transparent",
                transition: "all 0.3s",
                "&:hover": {
                  background: "#ff006622",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={onEndGame}
            >
              {translations.gameTimer.endGame[language]}
            </Button>
            <Button
              variant="outlined"
              css={{
                padding: "10px 20px",
                color: "#00ffff",
                border: "1px solid #00ffff",
                background: "transparent",
                transition: "all 0.3s",
                "&:hover": {
                  background: "#00ffff22",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={onContinueGame}
            >
              {translations.gameTimer.continueGame[language]}
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}; 
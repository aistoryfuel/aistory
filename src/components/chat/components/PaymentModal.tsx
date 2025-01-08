import React from "react";
import { Box, Button, Flex, Text } from "@fuel-ui/react";
import { PaymentModalProps } from "../types";
import { translations } from "../constants/translations";
import { MIN_PAYMENT_AMOUNT, TIME_PER_PAYMENT } from "../constants";

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  isLoading,
  amount,
  onAmountChange,
  onConfirm,
  onCancel,
  onIncrease,
  onDecrease,
  language
}) => {
  const calculateGameTime = (amount: string) => {
    const ethAmount = parseFloat(amount);
    if (isNaN(ethAmount)) return TIME_PER_PAYMENT;
    return Math.floor(ethAmount / MIN_PAYMENT_AMOUNT) * TIME_PER_PAYMENT;
  };

  if (!isOpen) return null;

  return (
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
      minWidth: "300px",
      backdropFilter: "blur(4px)",
    }}>
      <Text css={{
        color: "#00ffff",
        fontSize: "24px",
        marginBottom: "20px",
        textAlign: "center",
        textShadow: "0 0 8px #00ffff",
      }}>
        {translations.paymentTitle[language]}
      </Text>

      <Flex direction="column" gap="20px">
        <Box>
          <Text css={{ color: "#00ffff", marginBottom: "10px" }}>
            {translations.gameTime[language]}: {calculateGameTime(amount)} {translations.seconds[language]}
          </Text>
          <Text css={{ color: "#00ffff", fontSize: "14px" }}>
            {translations.minAmount[language]}: {MIN_PAYMENT_AMOUNT} ETH
          </Text>
          <Text css={{ color: "#00ffff", fontSize: "14px" }}>
            {translations.timePerPayment[language]}
          </Text>
        </Box>

        <Flex css={{ gap: "10px", alignItems: "center" }}>
          <Button
            variant="outlined"
            css={{
              padding: "8px 16px",
              color: "#00ffff",
              border: "1px solid #00ffff",
              background: "transparent",
              "&:hover": {
                background: "#00ffff11",
              },
            }}
            onClick={onDecrease}
          >
            -
          </Button>
          <Text css={{
            color: "#00ffff",
            fontSize: "20px",
            padding: "0 20px",
          }}>
            {amount} ETH
          </Text>
          <Button
            variant="outlined"
            css={{
              padding: "8px 16px",
              color: "#00ffff",
              border: "1px solid #00ffff",
              background: "transparent",
              "&:hover": {
                background: "#00ffff11",
              },
            }}
            onClick={onIncrease}
          >
            +
          </Button>
        </Flex>

        <Flex css={{ gap: "10px", justifyContent: "center" }}>
          <Button
            variant="outlined"
            css={{
              padding: "10px 20px",
              color: "#ff0066",
              border: "1px solid #ff0066",
              background: "transparent",
              "&:hover": {
                background: "#ff006611",
              },
            }}
            onClick={onCancel}
          >
            {translations.cancel[language]}
          </Button>
          <Button
            variant="outlined"
            css={{
              padding: "10px 20px",
              color: "#00ffff",
              border: "1px solid #00ffff",
              background: "transparent",
              "&:hover": {
                background: "#00ffff11",
              },
            }}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? translations.processing[language] : translations.payAndStart[language]}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}; 
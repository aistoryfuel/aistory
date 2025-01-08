import React from "react";
import { Box, Text } from "@fuel-ui/react";
import { ErrorModalProps } from "../types";

export const ErrorModal: React.FC<ErrorModalProps> = ({ show, message }) => {
  if (!show) return null;

  return (
    <Box css={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "linear-gradient(135deg, #ff000022, #00000088)",
      border: "1px solid #ff0000",
      borderRadius: "8px",
      padding: "20px",
      zIndex: 2000,
      textAlign: "center",
      minWidth: "300px",
      backdropFilter: "blur(4px)",
      animation: "glitch 0.3s infinite",
    }}>
      <Text css={{
        color: "#ff0000",
        fontSize: "18px",
        textShadow: "0 0 8px #ff0000",
        fontWeight: "bold",
      }}>
        {message}
      </Text>
    </Box>
  );
}; 
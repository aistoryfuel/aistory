import { Box } from "@fuel-ui/react";
import ChatInterface from "./components/chat/ChatInterface";

export default function App() {
  return (
    <Box css={{ minHeight: "100vh", background: "#000000" }}>
      <ChatInterface />
    </Box>
  );
}

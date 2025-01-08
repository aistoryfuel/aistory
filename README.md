# AI Story

An interactive storytelling experience powered by AI and blockchain technology.

🌐 **Live Demo**: [https://aistoryfuel.vercel.app/](https://aistoryfuel.vercel.app/)

## Features

- Interactive storytelling with AI-generated narratives
- Blockchain integration with Fuel Network
- Reward system for engaging choices
- Multi-language support (English & Chinese)
- Real-time wallet integration

## How to Play

1. Connect your wallet
2. Start the story
3. Make choices to progress through the narrative
4. Earn rewards for engaging choices

## Development

To run this project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_AI_WALLET_PRIVATE_KEY=your_wallet_private_key
VITE_AI_WALLET_ADDRESS=your_wallet_address
VITE_REWARD_ASSET_ID=your_reward_asset_id
VITE_IS_TESTNET=true
```

## Technologies Used

- React + TypeScript
- Vite
- OpenAI API
- Fuel Network
- @fuel-ui/react

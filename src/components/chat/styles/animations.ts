export const animations = `
  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-4px, 4px);
    }
    40% {
      transform: translate(-4px, -4px);
    }
    60% {
      transform: translate(4px, 4px);
    }
    80% {
      transform: translate(4px, -4px);
    }
    100% {
      transform: translate(0);
    }
  }
  
  @keyframes glitchBorder {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }
  
  @keyframes textGlitch {
    0% {
      opacity: 1;
      transform: translate(0);
    }
    20% {
      opacity: 0.7;
      transform: translate(-4px, 4px);
    }
    40% {
      opacity: 0.8;
      transform: translate(-4px, -4px);
    }
    60% {
      opacity: 0.7;
      transform: translate(4px, 4px);
    }
    80% {
      opacity: 0.8;
      transform: translate(4px, -4px);
    }
    100% {
      opacity: 1;
      transform: translate(0);
    }
  }
  
  @keyframes noise {
    0% {
      clip-path: inset(40% 0 61% 0);
    }
    20% {
      clip-path: inset(92% 0 1% 0);
    }
    40% {
      clip-path: inset(43% 0 1% 0);
    }
    60% {
      clip-path: inset(25% 0 58% 0);
    }
    80% {
      clip-path: inset(54% 0 7% 0);
    }
    100% {
      clip-path: inset(58% 0 43% 0);
    }
  }
  
  @keyframes noiseBackground {
    0% {
      opacity: 1;
      background-position: 0 0;
    }
    50% {
      opacity: 0.3;
      background-position: 100% 100%;
    }
    100% {
      opacity: 1;
      background-position: 0 0;
    }
  }
  
  @keyframes noiseText {
    0% {
      opacity: 1;
      text-shadow: 2px 0 #ff0066, -2px 0 #00ffff;
    }
    50% {
      opacity: 0.7;
      text-shadow: -2px 0 #ff0066, 2px 0 #00ffff;
    }
    100% {
      opacity: 1;
      text-shadow: 2px 0 #ff0066, -2px 0 #00ffff;
    }
  }
  
  @keyframes signalNoise {
    0%, 15%, 85%, 100% {
      opacity: 1;
      transform: translateX(0);
    }
    20% {
      opacity: 0.8;
      transform: translateX(0.5px);
    }
    25% {
      opacity: 1;
      transform: translateX(-0.5px);
    }
    30% {
      opacity: 0.9;
      transform: translateX(0.3px);
    }
    35% {
      opacity: 1;
      transform: translateX(0);
    }
    40% {
      opacity: 0.9;
      transform: translateX(-0.3px);
    }
    45% {
      opacity: 1;
      transform: translateX(0);
    }
    50% {
      opacity: 0.8;
      transform: translateX(0.5px);
    }
    55% {
      opacity: 1;
      transform: translateX(-0.5px);
    }
    60% {
      opacity: 0.9;
      transform: translateX(0.3px);
    }
    65% {
      opacity: 1;
      transform: translateX(0);
    }
    70% {
      opacity: 0.9;
      transform: translateX(-0.3px);
    }
    75% {
      opacity: 1;
      transform: translateX(0);
    }
    80% {
      opacity: 0.8;
      transform: translateX(0.5px);
    }
  }
  
  @keyframes signalDistortion {
    0%, 15%, 85%, 100% {
      opacity: 1;
      filter: brightness(1) contrast(1);
      transform: translateX(0);
      text-shadow: 0 0 8px #ff0066;
    }
    20% {
      opacity: 0.9;
      filter: brightness(1.2) contrast(1.1);
      transform: translateX(0.2px);
      text-shadow: 2px 0 #ff0066, -2px 0 #00ffff;
    }
    30% {
      opacity: 1;
      filter: brightness(0.9) contrast(1);
      transform: translateX(-0.2px);
      text-shadow: -2px 0 #ff0066, 2px 0 #00ffff;
    }
    40% {
      opacity: 0.95;
      filter: brightness(1.1) contrast(1.2);
      transform: translateX(0.2px);
      text-shadow: 2px 0 #ff0066, -2px 0 #00ffff;
    }
    50% {
      opacity: 1;
      filter: brightness(1) contrast(1);
      transform: translateX(0);
      text-shadow: -1px 0 #ff0066, 1px 0 #00ffff;
    }
    60% {
      opacity: 0.9;
      filter: brightness(1.2) contrast(1.1);
      transform: translateX(0.2px);
      text-shadow: 2px 0 #ff0066, -2px 0 #00ffff;
    }
    70% {
      opacity: 1;
      filter: brightness(0.9) contrast(1);
      transform: translateX(-0.2px);
      text-shadow: -2px 0 #ff0066, 2px 0 #00ffff;
    }
    80% {
      opacity: 0.95;
      filter: brightness(1.1) contrast(1.2);
      transform: translateX(0.2px);
      text-shadow: 1px 0 #ff0066, -1px 0 #00ffff;
    }
  }
  
  @keyframes scanline {
    0% {
      transform: translateY(0);
      opacity: 0.5;
    }
    50% {
      transform: translateY(100%);
      opacity: 0.3;
    }
    100% {
      transform: translateY(0);
      opacity: 0.5;
    }
  }
`; 
import React, { useState, useEffect } from 'react';
import { Text } from '@fuel-ui/react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  // 將文本按換行符分割，並保持換行效果
  const formattedText = displayedText.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <Text
      css={{
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        color: '#fff',
        textShadow: '0 0 4px #00ffff',
        width: '100%',
        wordBreak: 'break-word',
        display: 'block',
      }}
    >
      {formattedText}
    </Text>
  );
}; 
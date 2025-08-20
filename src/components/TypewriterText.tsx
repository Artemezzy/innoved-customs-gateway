import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  texts: string[];
  delay?: number;
  speed?: number;
  pauseBetween?: number;
  className?: string;
}

export function TypewriterText({ texts, delay = 1000, speed = 50, pauseBetween = 2000, className = "" }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentText = texts[currentTextIndex];

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseBetween);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting) {
      if (currentIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, speed / 2);
        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        setIsPaused(true);
      }
    }
  }, [currentIndex, currentText, speed, isStarted, isDeleting, isPaused, pauseBetween, texts.length]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
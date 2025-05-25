'use client'

import { useState, useEffect } from "react";

export const TypewriterText = ({ text, time = 20 }: { text: string, time?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, time);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    return <span>{displayedText}<span className="animate-pulse"></span></span>;
};
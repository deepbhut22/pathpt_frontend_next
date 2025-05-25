'use client'

import { useEffect, useState } from "react";

// Fade-in animation
export const FadeIn = ({ children, delay = 0, duration = 1000 }: { children: React.ReactNode, delay?: number, duration?: number }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
            }}
        >
            {children}
        </div>
    );
};
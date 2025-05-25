'use client';

import { useEffect, useRef, useState } from 'react';

export default function AutoShimmer({ borderRadius = '8px' }: { borderRadius?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div
                className="shimmer"
                style={{
                    width: size.width,
                    height: size.height,
                    borderRadius,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            />
            {/* This invisible box ensures layout space is reserved */}
            <div style={{ visibility: 'hidden' }}>
                {/* <slot /> */}
                <div style={{ width: size.width, height: size.height }} />
            </div>
        </div>
    );
}

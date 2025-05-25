// components/ui/ClientHaloWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import HaloBackground dynamically with SSR disabled
const HaloBackground = dynamic(() => import('@/components/ui/backgrounds/HaloBg'), {
    ssr: false,
});

export default function ClientHaloWrapper({
    xOffset,
    yOffset,
    size,
    height,
}: {
    xOffset: number;
    yOffset: number;
    size: number;
    height: string;
}) {
    return <HaloBackground xOffset={xOffset} yOffset={yOffset} size={size} height={height} />;
}

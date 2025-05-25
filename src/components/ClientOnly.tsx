'use client';

import useHasHydrated from '@/hooks/useHasHydrated';

export default function ClientOnly({
    children,
    fallback,
}: {
    children: React.ReactNode;
    fallback: React.ReactNode;
}) {
    const hasHydrated = useHasHydrated();
    return <>{hasHydrated ? children : fallback}</>;
}

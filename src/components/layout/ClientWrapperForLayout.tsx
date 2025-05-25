"use client";

import dynamic from "next/dynamic";

const Layout = dynamic(() => import('@/components/layout/Layout'), { ssr: false });

export default function ClientWrapperForLayout({ children }: { children: React.ReactNode }) {
    return <Layout>{children}</Layout>;
}

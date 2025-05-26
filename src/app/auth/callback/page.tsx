// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadinSpinner";
import useAuthStore from "@/store/authStore";

export default function GoogleCallback() {
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // No need to process the token, backend sets cookie
                await useAuthStore.getState().initializeAuth();

                // Redirect to home page or dashboard
                router.replace("/");
            } catch (error) {
                console.error("Error during Google auth callback:", error);
                router.replace("/login");
            }
        };

        initializeAuth();
    }, [router]);

    return (
        <LoadingSpinner
            message="Processing login..."
            size="large"
            fullScreen={true}
        />
    );
}

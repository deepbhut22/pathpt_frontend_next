"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { FormControl, Input, FormHelperText } from "@/components/ui/Form";
import Button from "@/components/ui/Button";
import { Loader, ArrowLeft } from "lucide-react";
import api from "@/utils/axios";

// Minimal popup for messages
function Popup({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="fixed top-4 right-4 bg-secondary-100 border border-secondary-300 text-secondary-950 px-4 py-2 rounded shadow z-50">
            <div className="flex items-center justify-between gap-2">
                <p>{message}</p>
                <button onClick={onClose} className="text-secondary-950 hover:underline">
                    Close
                </button>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!password || !confirmPassword || !token) {
            setPopupMessage("Please fill all the fields");
            return;
        }
        if (password !== confirmPassword) {
            setPopupMessage("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post("/auth/reset-password", {
                email,
                password,
                token,
            });

            if (response.status === 200) {
                setPopupMessage(response.data.message || "Password reset successful!");
                setIsLoading(false);
                setPassword("");
                setConfirmPassword("");
                setToken("");
                setEmail("");

                setTimeout(() => {
                    router.replace("/login");
                }, 3000);
            } else {
                setIsLoading(false);
                setPopupMessage(response.data.message || "Something went wrong");
            }
        } catch (error: any) {
            setIsLoading(false);
            setPopupMessage(error.response?.data?.message || "Something went wrong");
            console.error(error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get("token");
        const emailParam = urlParams.get("email");
        if (tokenParam && emailParam) {
            setToken(tokenParam);
            setEmail(emailParam);
        }
    }, []);

    return (
        <Layout className="flex flex-col items-center justify-center min-h-screen px-4">
            {/* Popup */}
            {popupMessage && (
                <Popup
                    message={popupMessage}
                    onClose={() => setPopupMessage(null)}
                />
            )}

            {/* Back Arrow */}
            <div
                onClick={() => router.back()}
                className="flex items-center gap-2 text-secondary-950 cursor-pointer self-start mb-4 hover:underline"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
            </div>

            {/* Reset Password Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto bg-secondary-100 border-2 border-secondary-300 py-8 px-4 rounded-lg shadow-lg"
            >
                <FormControl className="w-full">
                    <FormControl className="flex flex-col">
                        <Input
                            placeholder="Enter your new password"
                            className="bg-secondary-100 text-secondary-950"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormHelperText>Password must be at least 6 characters long</FormHelperText>
                        <div className="h-4" />
                        <Input
                            placeholder="Confirm your new password"
                            className="bg-secondary-100 text-secondary-950"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <FormHelperText>Re-enter your new password</FormHelperText>
                    </FormControl>
                </FormControl>

                <div className="flex justify-start w-full">
                    <Button
                        disabled={isLoading}
                        className="bg-secondary-950 text-white hover:bg-secondary-600"
                        type="submit"
                    >
                        {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Reset Password"}
                    </Button>
                </div>
            </form>
        </Layout>
    );
}

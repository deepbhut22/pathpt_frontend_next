'use client';

import CardTitle from "./ui/CardTitle";
import AutoShimmer from "./AutoShimmer";
import ClientOnly from "./ClientOnly";
import Card from "./ui/Card";
import CardHeader from "./ui/CardHeader";
import CardContent from "./ui/CardContent";
import { MessageCircle } from "lucide-react";
import Button from "./ui/Button";
import useAuthStore, { isProfileComplete } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/utils/axios";
import { MessagePopup } from "./ui/MessagePopup";

export default function BlogPageSideComponent() {
    const router = useRouter();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isProfileComplete = useUserStore(state => state.userProfile.isComplete);
    const isConsultationDialogOpen = useAuthStore(state => state.isConsultationDialogOpen);

    const [msg, setMsg] = useState('');
    

    const handleFindPathway = () => {
        if (isAuthenticated) {
            if (isProfileComplete) {
                router.push('/report');
            } else {
                useAuthStore.getState().setIsPopupOpen(true);
            }
        } else {
            useAuthStore.getState().setIsLoginRequiredPopupOpen(true);
        }
    }

    async function handleConsultationRequest() {
        try {

            if (!isAuthenticated) {
                useAuthStore.getState().setIsLoginRequiredPopupOpen(true);  
                return;
            }

            // setIsConsultancyLoading(true);
            const response = await api.get(`/consultancy/${useAuthStore.getState().user?._id}`);

            if (response.status === 200) {
                setMsg('You have already requested a consultation. Please wait for our response.');
            } else if (response.status === 201) {
                setMsg('Consultation request sent successfully. Please wait for our response.');
            }

            // setIsConsultancyLoading(false);

            // Wait 5 seconds before closing popup and clearing the message
            // setTimeout(() => {
            //   useAuthStore.getState().setIsConsultationDialogOpen(false);
            //   setMsg('');
            // }, 5000);

        } catch (error) {
            // setIsConsultancyLoading(false);
            setMsg('Something went wrong. Please try again later.');
            console.error(error);

            setTimeout(() => {
                useAuthStore.getState().setIsConsultationDialogOpen(false);
                setMsg('');
            }, 5000);
        }
    }

    return (
        <ClientOnly fallback={<AutoShimmer />}>
            <Card>
                <CardHeader>
                    <CardTitle>Expert Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-secondary-100 rounded-lg p-4">
                        <MessageCircle className="h-8 w-8 text-secondary-900 mb-2" />
                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">Have questions?</h3>
                        <p className="text-secondary-600 text-sm mb-3">
                            Get instant, personalized answers to all your immigration questions with MapleAI.
                        </p>
                        <Button
                            onClick={() => router.push('/mapleAi')}
                            size="sm"
                            className="w-full bg-secondary-900 text-white hover:bg-secondary-950"
                        >Chat with MapleAI</Button>
                    </div>
                </CardContent>

                <div className="border-t border-secondary-200">
                </div>

                <CardHeader>
                    <CardTitle>Licensed(RCIC) Consultants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col bg-secondary-100 p-4 rounded-lg w-full">
                        <h3 className="font-medium text-secondary-900 mb-2">
                            Connect with Licensed(RCIC) Consultants For Free
                        </h3>
                        <p className="text-sm text-secondary-600 mb-4">
                            Get personalized guidance from a regulated immigration consultant.
                        </p>

                        <Button
                            onClick={() => useAuthStore.getState().setIsConsultationDialogOpen(true)}
                            size="sm" className="w-full bg-secondary-900 text-white hover:bg-secondary-950">
                            Book Consultation
                        </Button>
                    </div>
                </CardContent>

                <div className="border-t border-secondary-200">
                </div>

                <CardHeader>
                    <CardTitle>
                        Find Your Immigration Pathway And Begin Your Canadian Journey.
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col bg-secondary-100 p-4 rounded-lg w-full">
                        <p className="text-secondary-700 mb-4">
                            Answer a few questions about yourself and get personalized immigration recommendations.
                        </p>
                        <Button
                            onClick={handleFindPathway}
                            size="sm"
                            className="w-full bg-secondary-900 text-white hover:bg-secondary-950"
                        >
                            {isAuthenticated
                                ? (isProfileComplete ? 'View My Pathways' : 'Complete My Profile')
                                : 'Start Assessment'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <MessagePopup
                isOpen={isConsultationDialogOpen}
                onClose={() => useAuthStore.getState().setIsConsultationDialogOpen(false)}
                title="Consultation Request"
                message={msg === '' ? "This feature is currently under development. Raise your request and we will get back to you soon." : msg}
                type={msg === '' ? 'info' : msg === 'You have already requested a consultation. Please wait for our response.' ? 'warning' : 'success'}
                actionText="Raise Request"
                onAction={() => {
                    handleConsultationRequest();
                }}
                cancelText="Close"
                maxWidth="2xl"
            />  
        </ClientOnly>
    )
}
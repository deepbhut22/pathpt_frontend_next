'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Step } from '@/types';
import { getNextStep, getCurrentStepName } from '@/utils/helpers';
import { useUserStore } from '@/store/userStore';
import Layout from '@/components/layout/Layout';
import QuestionnaireLayout from '@/components/questionnaire/QuestionnaireLayout';
import BasicInfo from '@/components/questionnaire/steps/BasicInfo';
import Language from '@/components/questionnaire/steps/Language';
import Education from '@/components/questionnaire/steps/Education';
import Spouse from '@/components/questionnaire/steps/Spouse';
import Dependent from '@/components/questionnaire/steps/Dependent';
import Connection from '@/components/questionnaire/steps/Connection';
import Work from '@/components/questionnaire/steps/Work';
import JobOffer from '@/components/questionnaire/steps/JobOffer';
import { isProfileComplete } from '@/utils/profileUtils';
import api from '@/utils/axios';

export default function Questionnaire() {
    const params = useParams();
    const step = typeof params.step === 'string' ? params.step : 'basic';
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setProfileComplete } = useUserStore();
    console.log('Rendering step page');
    console.log('Step:', step);

    const currentStep = step as Step;

    const handleValidationChange = (valid: boolean) => {
        setIsValid(valid);
    };

    const handleNext = async () => {
        setIsSubmitting(true);

        await handleSave();

        // Simulating saving to backend
        setTimeout(() => {
            const nextStep = getNextStep(currentStep);

            if (nextStep) {
                router.push(`/questionnaire/${nextStep}`);
            } else {
                // This is the last step, mark profile as complete and redirect to report
                setProfileComplete(true);
                router.push('/report');
            }

            setIsSubmitting(false);
        }, 500);
    };

    const handlePrevious = () => {
        const prevUrl = currentStep === 'basic' ? '/' : `/questionnaire/${getPrevStep()}`;
        router.push(prevUrl);
    };

    const handleSave = async () => {
        console.log(useUserStore.getState().userProfile.educationInfo);

        try {
            const currentStepData = getCurrentStepName(currentStep);
            const response = await api.put(`/profile/${currentStep}`, currentStepData);
            if (response.status === 200) {
                setProfileComplete(isProfileComplete(useUserStore.getState().userProfile));

                alert('Progress saved successfully!');
            } else {
                alert('Error saving progress!');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            alert('Error saving progress!');
        }
    };

    const getPrevStep = (): string => {
        switch (currentStep) {
            case 'language':
                return 'basic';
            case 'education':
                return 'language';
            case 'spouse':
                return 'education';
            case 'dependent':
                return 'spouse';
            case 'connection':
                return 'dependent';
            case 'work':
                return 'connection';
            case 'joboffer':
                return 'work';
            default:
                return 'basic';
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'basic':
                return <BasicInfo onValidationChange={handleValidationChange} />;
            case 'language':
                return <Language onValidationChange={handleValidationChange} />;
            case 'education':
                return <Education onValidationChange={handleValidationChange} />;
            case 'spouse':
                return <Spouse onValidationChange={handleValidationChange} />;
            case 'dependent':
                return <Dependent onValidationChange={handleValidationChange} />;
            case 'connection':
                return <Connection onValidationChange={handleValidationChange} />;
            case 'work':
                return <Work onValidationChange={handleValidationChange} />;
            case 'joboffer':
                return <JobOffer onValidationChange={handleValidationChange} />;
            default:
                return <div>Invalid step</div>;
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <Layout>
            <QuestionnaireLayout
                currentStep={currentStep}
                isValid={isValid}
                isSubmitting={isSubmitting}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSave={handleSave}
            >
                {renderStepContent()}
            </QuestionnaireLayout>
        </Layout>
    );
}
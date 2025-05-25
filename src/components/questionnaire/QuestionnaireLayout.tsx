'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BaggageClaim, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Step } from '../../types';
import { navigationSteps, getStepIndex, getNextStep, getPreviousStep } from '../../utils/helpers';
import Button from '../ui/Button';

interface QuestionnaireLayoutProps {
  children: React.ReactNode;
  currentStep: Step;
  isValid: boolean;
  isSubmitting?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSave?: () => void;
}

export default function QuestionnaireLayout({
  children,
  currentStep,
  isValid,
  isSubmitting = false,
  onNext,
  onPrevious,
  onSave
}: QuestionnaireLayoutProps) {
  const router = useRouter();
  const currentStepIndex = getStepIndex(currentStep);
  
  const progress = ((currentStepIndex + 1) / navigationSteps.length) * 100;
  
  const nextStep = getNextStep(currentStep);
  const prevStep = getPreviousStep(currentStep);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Find Your Canadian Immigration Pathway</h1>
        <p className="text-secondary-600">
          Complete your profile to get personalized immigration recommendations.
        </p>
      </div>

      {/* <div className="mb-6 flex flex-wrap gap-2 justify-start p-1">
        {navigationSteps.map((step, idx) => (
          <div key={step.id} className="bg-white border border-secondary-200 shadow-sm p-2 rounded-md cursor-pointer hover:shadow-md transition-all duration-">
            <p className="text-sm text-secondary-950">
              <span className="text-secondary-500 rounded-full bg-secondary-50 px-2 py-1 border border-secondary-200">{idx + 1}</span> {step.title}
            </p>
          </div>
        ))}
      </div> */}
      <div 
        onClick={() => router.push('/profile')}
        className="mb-2 flex justify-between cursor-pointer items-center p-1 w-min gap-2">
        <ArrowLeft className="text-secondary-950" />
        <p className="text-md text-secondary-950 font-semibold">
          back
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 mb-6">
        <div className="p-4 border-b border-secondary-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-secondary-700">
              Step {currentStepIndex + 1} of {navigationSteps.length}
            </span>
            {/* <span className="text-sm text-secondary-500">
              {Math.round(progress)}% Complete
            </span> */}
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-secondary-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          {/* <h2 className="text-xl font-semibold text-secondary-900 mb-1">
            {navigationSteps[currentStepIndex].title}
          </h2> */}
          {/* <p className="text-secondary-600 mb-6">
            {navigationSteps[currentStepIndex].description}
          </p> */}

          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 w-full">
        {/* Left: Back or Previous Button */}
        <div className="w-full sm:w-auto">
          {prevStep ? (
            <Button
              variant="outline"
              onClick={onPrevious}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 w-full sm:w-auto">
          {onSave && (
            <Button
              variant="secondary"
              onClick={onSave}
              className={`w-full sm:w-auto ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              leftIcon={<Save className="h-4 w-4" />}
              disabled={!isValid || isSubmitting}
            >
              Save Progress
            </Button>
          )}

          {nextStep ? (
            <Button
              onClick={onNext}
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              rightIcon={<ChevronRight className="h-4 w-4" />}
              className={`w-full sm:w-auto bg-secondary-900 text-white hover:bg-secondary-950 hover:border hover:border-secondary-950 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              className="w-full sm:w-auto bg-secondary-900 text-white hover:bg-secondary-950 hover:border hover:border-secondary-950"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
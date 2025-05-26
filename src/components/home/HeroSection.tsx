import React, { useState, useEffect } from 'react';
import { CheckCircle, TextSelectionIcon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import VantaHaloBackground from '../ui/backgrounds/HaloBg';
import { TypewriterText } from './TypeWriterText';
import { FadeIn } from './FadeIn';


export default function HeroSection() {
  const router = useRouter();
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const isProfileComplete = useUserStore((state) => state.userProfile.isComplete); 

  function handleRedirect(): void {
    if (isAuth) {
      if (!isProfileComplete) {
        useAuthStore.getState().setIsPopupOpen(true);
      } else {
        router.push('/report');
      }
    } else {
      useAuthStore.getState().setIsLoginRequiredPopupOpen(true);
    }
  }

  return (
    <>
    <div className="pt-10 bg-gray-950 text-white min-h-screen bg-white flex items-center relative overflow-hidden">
      {/* Background network effect for the entire page */}
      <div className="hidden md:block absolute inset-0 pointer-events-none w-full">
        {/* <BackgroundAnimation /> */}
        <VantaHaloBackground xOffset={0.18} yOffset={0.0} size={1.5} />
      </div>

      <div className="block md:hidden absolute inset-0 pointer-events-none w-full">
        {/* <BackgroundAnimation /> */}
        <VantaHaloBackground xOffset={0.0} yOffset={-0.26} size={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column - Main Text */}
          <div className="space-y-6 md:space-y-8 sm:w-max">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-blue-50 max-w-full md:max-w-[90%] lg:max-w-[80%]">
                <TypewriterText text="Find Your Perfect Canadian Immigration Pathway" />
              </h1>

              <p className="text-base sm:text-md md:text-lg text-blue-200 max-w-xl">
                <span className="glow-text font-bold text-white">AI-powered guidance</span> to navigate your journey to Canada with personalized
                recommendations and expert support.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Comprehensive Assessment",
                    desc: "Evaluate eligibility across 80+ immigration programs",
                  },
                  {
                    title: "Real-Time Matching",
                    desc: "Get matched with pathways based on your qualifications",
                  },
                  {
                    title: "Personalized Scoring",
                    desc: "Calculate your CRS score across multiple programs",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm sm:text-base font-medium mb-1">{item.title}</h3>
                      <p className="text-blue-200 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 w-full sm:w-1/2 sm:gap-4 mt-6">
                  <button
                    onClick={handleRedirect}
                    className="p-[3px] relative sm:w-auto w-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="p-2 bg-secondary-950 rounded-[6px] text-sm md:text-md relative group transition duration-200 text-white hover:bg-transparent">
                      Get My Free All In One AI-Powered PR Report
                    </div>
                  </button>
                  <div className="flex flex-row gap-3 w-full">
                    <button
                      onClick={() => {
                        if (isAuth) {
                          if (isProfileComplete) {
                            router.push('/mapleAi')
                          } else {
                            useAuthStore.getState().setIsPopupOpen(true);
                          }
                        } else {
                          useAuthStore.getState().setIsLoginRequiredPopupOpen(true);
                        }
                      }}
                      className="p-[3px] relative w-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                      <div className="p-2 bg-secondary-950 rounded-[6px] text-sm md:text-md relative group transition duration-200 text-white hover:bg-transparent h-full flex justify-center items-center">
                        Maple AI
                      </div>
                    </button>
                    <button
                      onClick={() => router.push('/immigration-statistics')}
                      className="p-[3px] relative w-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                      <div className="p-2 bg-secondary-950 rounded-[6px] text-sm md:text-md relative group transition duration-200 text-white hover:bg-transparent h-full flex justify-center items-center">
                        Recent Trends
                      </div>
                    </button>
                  </div>
              </div>
          </div>

          {/* Right Column - Optional image/graphic */}
          <div className="hidden lg:block h-96">
            {/* Leave empty or include optional illustration */}
          </div>
        </div>
      </div>
        <div className="hidden sm:block absolute bottom-0 w-full h-24 overflow-hidden z-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 C30,120 70,120 100,0 L100,100 L0,100 Z"

              fill="white"
            />
          </svg>
        </div>
    </div>
    </>
  );

}
'use client';

import { useEffect, useRef, useState } from 'react';
import VantaHaloBackground from '@/components/ui/backgrounds/HaloBg'; // Adjust import path as needed
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { MessagePopup } from '@/components/ui/MessagePopup';
import Layout, { benefits } from '@/components/layout/Layout';

const AboutUs = () => {
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const missionRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isProfileComplete = useUserStore((state) => state.userProfile.isComplete);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        const createObserver = (ref: React.RefObject<HTMLDivElement>, delay: number = 0) => {
            if (ref.current) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.classList.add('animate-in');
                                }, delay);
                            }
                        });
                    },
                    { threshold: 0.1 }
                );
                observer.observe(ref.current);
                observers.push(observer);
            }
        };

        createObserver(heroRef, 200);
        createObserver(featuresRef, 400);
        createObserver(missionRef, 600);
        createObserver(teamRef, 800);

        return () => observers.forEach(observer => observer.disconnect());
    }, []);

    const handleStartAssessment = () => {
        if (isAuthenticated) {
            if (isProfileComplete) {
                router.push('/report');
            } else {
                useAuthStore.getState().setIsPopupOpen(true);
            }
        } else {
            useAuthStore.getState().setIsLoginRequiredPopupOpen(true);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-secondary-950 text-white overflow-hidden">
                {/* Hero Section with Vanta Background */}
            <section className="relative h-screen flex flex-col items-center justify-start pt-20">
                <div className="absolute inset-0 z-0">
                    <VantaHaloBackground xOffset={0} yOffset={-0.5} size={2.5} height="100vh" />
                </div>
                <div
                    ref={heroRef}
                    className="relative z-10 mt-10 text-center max-w-4xl mx-auto px-6 opacity-0 translate-y-12 transition-all duration-1000 ease-out"
                >
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                        About PathPR
                    </h1>
                    <p className="text-xl md:text-2xl text-secondary-300 leading-relaxed max-w-3xl mx-auto">
                        Your trusted partner in navigating the Canadian immigration journey with cutting-edge AI technology and personalized guidance.
                    </p>
                    {/* <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div> */}
                </div>
                    <div className="hidden sm:block absolute bottom-0 w-full h-24 overflow-hidden z-10 mb-2">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0,0 C30,120 70,120 100,0 L100,100 L0,100 Z"

                                // fill="#090f20"
                                fill="white"
                            />
                        </svg>
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

                            // fill="#090f20"
                            fill="#020617"
                        />
                    </svg>
                </div>
            </section>


            {/* Features Section */}
            <section
                ref={featuresRef}
                className="py-20 px-6 backdrop-blur-sm opacity-0 translate-y-12 transition-all duration-1000 ease-out"
            >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-secondary-100">
                        What Makes Us Different
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "100% Free AI Reports",
                                description: "Get comprehensive immigration assessments powered by advanced AI technology, completely free of charge.",
                                icon: "🤖",
                                delay: "0ms"
                            },
                            {
                                title: "MapleAI Assistant",
                                description: "Your personal AI immigration consultant available 24/7 to answer questions and guide your journey.",
                                icon: "🍁",
                                delay: "200ms"
                            },
                            {
                                title: "Immigration Dashboard",
                                description: "Track your progress, manage documents, and stay organized with our intuitive dashboard.",
                                icon: "📊",
                                delay: "400ms"
                            },
                            {
                                title: "Latest News & Blogs",
                                description: "Stay updated with the most recent immigration policies, news, and expert insights.",
                                icon: "📰",
                                delay: "600ms"
                            },
                            {
                                title: "Expert Consultants",
                                description: "Connect with certified immigration consultants for personalized professional guidance.",
                                icon: "👥",
                                delay: "800ms"
                            },
                            {
                                title: "Success-Focused",
                                description: "Our platform is designed with one goal: maximizing your immigration success rate.",
                                icon: "🎯",
                                delay: "1000ms"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-secondary-800/60 backdrop-blur-sm rounded-2xl p-8 border border-secondary-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                                style={{ animationDelay: feature.delay }}
                            >
                                <div className="text-4xl mb-4 animate-bounce">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-4 text-secondary-100">{feature.title}</h3>
                                <p className="text-secondary-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section
                ref={missionRef}
                className="py-20 px-6 opacity-0 translate-y-12 transition-all duration-1000 ease-out"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-secondary-100">
                                Our Mission
                            </h2>
                            <p className="text-lg text-secondary-300 leading-relaxed mb-6">
                                At PathPR.ca, we believe that everyone deserves a clear, transparent, and successful path to Canadian immigration. We've revolutionized the traditional immigration consulting model by integrating artificial intelligence with human expertise.
                            </p>
                            <p className="text-lg text-secondary-300 leading-relaxed mb-8">
                                Our platform eliminates the confusion and uncertainty that often accompanies immigration processes. Whether you're just starting to explore your options or you're ready to submit your application, we're here to guide you every step of the way.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                <p className="text-xl font-semibold text-blue-400 italic">
                                    "Your Path, Your Consultant, Your Success!"
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-secondary-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div className="bg-secondary-800/50 rounded-xl p-6">
                                        <div className="text-3xl font-bold text-blue-400 mb-2">1,000+</div>
                                        <div className="text-secondary-300">Success Stories</div>
                                    </div>
                                    <div className="bg-secondary-800/50 rounded-xl p-6">
                                        <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                                        <div className="text-secondary-300">AI Support</div>
                                    </div>
                                    <div className="bg-secondary-800/50 rounded-xl p-6">
                                        <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                                        <div className="text-secondary-300">Success Rate</div>
                                    </div>
                                    <div className="bg-secondary-800/50 rounded-xl p-6">
                                        <div className="text-3xl font-bold text-yellow-400 mb-2">Free</div>
                                        <div className="text-secondary-300">AI Reports</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section
                ref={teamRef}
                className="py-20 px-6 bg-secondary-900/30 backdrop-blur-sm opacity-0 translate-y-12 transition-all duration-1000 ease-out"
            >
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-secondary-100">
                        Why Choose PathPR.ca?
                    </h2>
                    <p className="text-xl text-secondary-300 mb-16 max-w-4xl mx-auto leading-relaxed">
                        We combine the precision of artificial intelligence with the warmth of human expertise to create an unparalleled immigration experience.
                    </p>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Technology-Driven",
                                description: "Our AI analyzes thousands of successful cases to provide you with the most accurate guidance.",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                title: "Human-Centered",
                                description: "Behind every AI recommendation is a team of certified immigration experts ready to assist.",
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                title: "Results-Focused",
                                description: "We measure our success by your success. Your Canadian dream is our commitment.",
                                gradient: "from-green-500 to-emerald-500"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group cursor-pointer"
                            >
                                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-secondary-100 group-hover:text-blue-400 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-secondary-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl border border-secondary-700/50">
                        <h3 className="text-2xl font-semibold mb-4 text-secondary-100">Ready to Begin Your Journey?</h3>
                        <p className="text-secondary-300 mb-6">
                            Join thousands of successful immigrants who trusted PathPR.ca with their Canadian dreams.
                        </p>
                        <button 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={handleStartAssessment}
                        >
                            Start Your Free Assessment
                        </button>
                    </div>
                </div>
            </section> 
            </div>
        </Layout>
    );
};

export default AboutUs;

// Add this CSS to your global styles
/*
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
*/
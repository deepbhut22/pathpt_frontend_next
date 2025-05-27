'use client';

import { useEffect, useRef, useState } from 'react';
import VantaHaloBackground from '@/components/ui/backgrounds/HaloBg'; // Adjust import path as needed
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    consultationType: string;
}

const ContactUs = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consultationType: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const contactInfoRef = useRef<HTMLDivElement>(null);
    const faqRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

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
        createObserver(contactInfoRef, 400);
        createObserver(formRef, 600);
        createObserver(faqRef, 800);

        return () => observers.forEach(observer => observer.disconnect());
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            consultationType: 'general'
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-secondary-950  text-white overflow-hidden">
                {/* Hero Section */}
                <section className="relative h-screen flex flex-col items-center justify-start pt-20">
                    <div className="absolute inset-0 z-0">
                        <VantaHaloBackground xOffset={0} yOffset={-0.5} size={2.5} height="100vh" />
                    </div>
                    <div
                        ref={heroRef}
                        className="relative z-10 mt-10 text-center max-w-4xl mx-auto px-6 opacity-0 translate-y-12 transition-all duration-1000 ease-out"
                    >
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                            Contact Us
                        </h1>
                        <p className="text-xl md:text-2xl text-secondary-300 leading-relaxed max-w-3xl mx-auto">
                            Ready to start your Canadian immigration journey? We're here to help you every step of the way.
                        </p>
                        {/* <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div> */}
                    </div>
                    <div className="hidden sm:block absolute bottom-0 w-full h-24 mb-2 overflow-hidden z-10">
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
                                fill="#090f20"
                            />
                        </svg>
                    </div>
                </section>

                {/* Contact Information */}
                <section
                    ref={contactInfoRef}
                    className="py-20 px-6 bg-secondary-900/50 backdrop-blur-sm opacity-0 translate-y-12 transition-all duration-1000 ease-out"
                >
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-secondary-100">
                            Get In Touch
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: "📧",
                                    title: "Email Support",
                                    info: "support@pathpr.ca",
                                    description: "24/7 email support for all your questions",
                                    gradient: "from-blue-500 to-cyan-500"
                                },
                                {
                                    icon: "📞",
                                    title: "Phone Support",
                                    info: "+1 (438) 927-5153",
                                    description: "Contact with our team",
                                    gradient: "from-green-500 to-emerald-500"
                                },
                                {
                                    icon: "💬",
                                    title: "Live Chat",
                                    info: "Available 24/7",
                                    description: "Instant help with MapleAI assistant",
                                    gradient: "from-purple-500 to-pink-500"
                                },
                                {
                                    icon: "📍",
                                    title: "Office Location",
                                    info: "Vancouver, BC",
                                    description: "Virtual consultations available worldwide",
                                    gradient: "from-orange-500 to-red-500"
                                }
                            ].map((contact, index) => (
                                <div
                                    key={index}
                                    className="group bg-secondary-800/60 backdrop-blur-sm rounded-2xl p-8 border border-secondary-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 text-center"
                                >
                                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${contact.gradient} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                                        {contact.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-secondary-100">{contact.title}</h3>
                                    <p className="text-lg font-medium text-blue-400 mb-3">{contact.info}</p>
                                    <p className="text-secondary-400 text-sm leading-relaxed">{contact.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section
                    ref={formRef}
                    className="py-20 px-6 opacity-0 translate-y-12 transition-all duration-1000 ease-out"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-secondary-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-secondary-700/50">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-secondary-100">
                                Send Us a Message
                            </h2>

                            {submitted && (
                                <div className="mb-8 p-6 bg-green-600/20 border border-green-500/50 rounded-xl text-center animate-pulse">
                                    <div className="text-green-400 text-xl mb-2">✅ Message Sent Successfully!</div>
                                    <p className="text-green-300">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-secondary-300 mb-2 font-medium">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-secondary-900/50 border border-secondary-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-secondary-400"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-secondary-300 mb-2 font-medium">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-secondary-900/50 border border-secondary-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-secondary-400"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-secondary-300 mb-2 font-medium">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-secondary-900/50 border border-secondary-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-secondary-400"
                                            placeholder="+1 (xxx) xxx-xxxx"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-secondary-300 mb-2 font-medium">Consultation Type</label>
                                        <select
                                            name="consultationType"
                                            value={formData.consultationType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-secondary-900/50 border border-secondary-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white"
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="express-entry">Express Entry</option>
                                            <option value="pnp">Provincial Nominee Program</option>
                                            <option value="family-sponsorship">Family Sponsorship</option>
                                            <option value="study-permit">Study Permit</option>
                                            <option value="work-permit">Work Permit</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-secondary-300 mb-2 font-medium">Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-secondary-900/50 border border-secondary-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-secondary-400"
                                        placeholder="What can we help you with?"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-secondary-300 mb-2 font-medium">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-secondary-900/50 border border-secondary-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-secondary-400 resize-none"
                                        placeholder="Tell us about your immigration goals and how we can help..."
                                    ></textarea>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-secondary-600 disabled:to-secondary-700 text-white px-12 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Sending Message...</span>
                                            </div>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section
                    ref={faqRef}
                    className="py-20 px-6 bg-secondary-900/30 backdrop-blur-sm opacity-0 translate-y-12 transition-all duration-1000 ease-out"
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-secondary-100">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    question: "How quickly will I receive a response?",
                                    answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, you can use our live chat feature for immediate assistance."
                                },
                                {
                                    question: "Are your AI-generated reports really free?",
                                    answer: "Yes! Our AI-generated immigration assessment reports are completely free. We believe everyone deserves access to accurate immigration guidance."
                                },
                                {
                                    question: "Can I schedule a consultation with a human expert?",
                                    answer: "Absolutely! While MapleAI provides 24/7 assistance, you can also schedule consultations with our certified immigration consultants for personalized guidance."
                                },
                                {
                                    question: "Do you provide services for all immigration programs?",
                                    answer: "Yes, we cover all major Canadian immigration programs including Express Entry, Provincial Nominee Programs, Family Sponsorship, Study and Work Permits, and more."
                                },
                                {
                                    question: "Is my personal information secure?",
                                    answer: "We take privacy seriously. All your personal information is encrypted and stored securely according to Canadian privacy laws and regulations."
                                }
                            ].map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-secondary-800/60 backdrop-blur-sm rounded-2xl p-6 border border-secondary-700/50 hover:border-blue-500/30 transition-all duration-300"
                                >
                                    <h3 className="text-xl font-semibold mb-3 text-secondary-100 flex items-center">
                                        <span className="text-blue-400 mr-3">Q:</span>
                                        {faq.question}
                                    </h3>
                                    <p className="text-secondary-300 leading-relaxed pl-8">
                                        <span className="text-green-400 mr-3">A:</span>
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-8 border border-secondary-700/50">
                                <h3 className="text-2xl font-semibold mb-4 text-secondary-100">Still Have Questions?</h3>
                                <p className="text-secondary-300 mb-6">
                                    Our MapleAI assistant is available 24/7 to provide instant answers to your immigration questions.
                                </p>
                                <button 
                                    onClick={() => router.push('/mapleAi')}
                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Chat with MapleAI Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default ContactUs;

// Add this CSS to your global styles
/*
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
*/
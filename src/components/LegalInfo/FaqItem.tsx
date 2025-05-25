'use client';

import { useState } from 'react';

export default function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 pb-4">
            <button
                className="flex justify-between items-center w-full text-left font-semibold text-gray-700 hover:text-gray-900 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{question}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <div className="mt-3 text-gray-600">
                    <p className="pl-4 border-l-2" style={{ borderColor: '#1e3a6d' }}>
                        {answer}
                    </p>
                </div>
            )}
        </div>
    );
}
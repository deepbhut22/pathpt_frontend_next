// app/blogs/[slug]/ShareButtons.tsx
'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
    title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
    const [shareMessage, setShareMessage] = useState('');

    // Get URL on client side
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareMessage('Link copied!');
            setTimeout(() => setShareMessage(''), 2000);
        } catch (err) {
            setShareMessage('Failed to copy');
            setTimeout(() => setShareMessage(''), 2000);
        }
    };

    return (
        <div className="mb-8 flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Share:</span>
            <button
                onClick={shareOnFacebook}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                aria-label="Share on Facebook"
            >
                <Facebook className="h-4 w-4" />
            </button>
            <button
                onClick={shareOnTwitter}
                className="p-2 rounded-full bg-blue-100 text-blue-400 hover:bg-blue-200 transition-colors"
                aria-label="Share on Twitter"
            >
                <Twitter className="h-4 w-4" />
            </button>
            <button
                onClick={shareOnLinkedIn}
                className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="h-4 w-4" />
            </button>
            <button
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Copy link"
            >
                <Share2 className="h-4 w-4" />
            </button>
            {shareMessage && (
                <span className="text-sm text-green-600 ml-2">{shareMessage}</span>
            )}
        </div>
    );
}
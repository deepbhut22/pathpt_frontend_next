'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import FAQ from '@/components/LegalInfo/FAQ';
import Privacy from '@/components/LegalInfo/Privacy';
import Disclaimer from '@/components/LegalInfo/Disclaimer';
import Terms from '@/components/LegalInfo/Terms';

const VALID_TABS = ['faqs', 'privacy', 'disclaimer', 'terms'];

export default function LegalInfoComponent() {

    const { tab } = useParams();
    const router = useRouter(); 
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [invalidTab, setInvalidTab] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (tab && VALID_TABS.includes(tab as string)) {
            setActiveTab(tab as string);
            setInvalidTab(false);
        } else {
            setInvalidTab(true);
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    }, [tab, router]);

    const tabStyle = (t: string) => ({
        padding: activeTab === t ? '0.75rem 1.5rem' : '0.75rem 1rem',
        fontWeight: activeTab === t ? '600' : '400',
        backgroundColor: activeTab === t ? '#102954' : 'white',
        color: activeTab === t ? 'white' : '#102954',
        border: activeTab === t ? 'none' : '1px solid #102954',
        borderRadius: activeTab === t ? '0.25rem 0.25rem 0 0' : '0.25rem',
        cursor: 'pointer',
        marginRight: '0.25rem',
        transition: 'all 0.3s ease'
    });

    if (invalidTab) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
                    Page Not Found. Redirecting...
                </div>
            </Layout>
        );
    }

    // Then render your tab layout (same as current structure)
    // ... Just replace all `activeTab === 'privacy'` etc. with the new state

    return (
        <>
            <Layout>
                <div className="bg-gray-100 min-h-screen p-4 mt-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gray-100 p-4">
                                <h1 className="text-2xl font-bold text-center text-gray-800">PathPR.ca Legal Information</h1>

                                {/* Tab Navigation */}
                                <div className="flex mt-6">
                                    {VALID_TABS.map((t) => (
                                        <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Dynamic Content */}
                                <div
                                    className="bg-white p-6 border-t-4"
                                    style={{ borderColor: '#102954' }}
                                >
                                    {activeTab === 'faqs' && <FAQ />}
                                    {activeTab === 'privacy' && <Privacy />}
                                    {activeTab === 'disclaimer' && <Disclaimer />}
                                    {activeTab === 'terms' && <Terms />}

                                    <div className="mt-6 text-sm text-gray-500 text-center">
                                        Effective Date: May 3, 2025<br />
                                        For further questions or concerns, please contact us at contact@pathpr.ca
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

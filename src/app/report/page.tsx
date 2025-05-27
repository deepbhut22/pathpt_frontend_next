'use client';

import { useUserStore } from '@/store/userStore';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import CardTitle from '@/components/ui/CardTitle';
import CardContent from '@/components/ui/CardContent';
import CardFooter from '@/components/ui/CardFooter';
import Button from '@/components/ui/Button';
import { MessageCircle, Edit, ExternalLink, Clipboard, CheckCircle, AlertTriangle, Info, Dot } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import api from '@/utils/axios';
import { useExpressEntryStore, useRecommendationStore } from '@/store/reports';
import { usePNPStore } from '@/store/reports';

import { useReportData } from '@/hooks/useReportData';
import LoadingSpinner from '@/components/ui/LoadinSpinner';
import { PNPOptionsDialog } from '@/components/PNPOptionsDialog';
import { SuggestionsDialog } from '@/components/SuggestionsDialog';
import { alternativePrograms } from '@/utils/dummyData';
import { AlternativePathwaysDialog } from '@/components/AlternativePathwaysDialog';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ChatBox from '@/components/ui/ChatBox';
import { MessagePopup } from '@/components/ui/MessagePopup';
import { useRouter } from 'next/navigation';
// import { ConsultantCard } from './ConsultantList';
import ConsultantFakeData from '@/utils/ConsultanatFakeData.json';
import { Consultant } from '@/types';
import React, { useRef, useState } from 'react';
import Link from 'next/link';

const infoDialogData = {
    "crs": (
        <div className="max-w-lg p-6 bg-white shadow-lg rounded-lg" >
            <h2 className="text-2xl font-bold mb-4">Comprehensive Ranking System (CRS)</h2>
            <p className="mb-4">
                The CRS is a points-based tool IRCC uses to score and rank all profiles in the Express Entry pool.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Factors considered:</strong> age, education, work experience (Canadian &amp; foreign), language ability, arranged employment, provincial nomination, spouse factors.</li>
                <li><strong>Maximum score:</strong> 1,200 points.</li>
                <li><strong>Why it matters:</strong> Your CRS rank determines if and when you receive an Invitation to Apply (ITA) for PR.</li>
            </ul>
        </div >
    ),
    "fswp": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Federal Skilled Worker Program (FSWP)</h2>
        <p className="mb-4">
            A federal pathway for skilled workers with proven foreign work experience.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Work Experience:</strong> ≥1 year paid, full-time skilled work (NOC TEER 0–3) in last 10 years.</li>
            <li><strong>Language:</strong> CLB 7+ (IELTS 6.0+) in all four skills (English/French).</li>
            <li><strong>Education:</strong> Canadian secondary/post-secondary credential or ECA equivalency.</li>
            <li><strong>Points Grid:</strong> ≥67/100 on factors: age, education, language, experience, adaptability.</li>
            <li><strong>Process:</strong> Submit Express Entry profile → receive ITA → apply for PR.</li>
        </ul>
    </div>),

    "cec": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Canadian Experience Class (CEC)</h2>
        <p className="mb-4">
            Designed for candidates with skilled work experience in Canada.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Experience:</strong> ≥12 months full-time (or equivalent part-time) skilled work (NOC 0–3) in Canada within last 3 years.</li>
            <li><strong>Language:</strong> CLB 7 for NOC 0/TEER 1/2; CLB 5 for TEER 3.</li>
            <li><strong>Status:</strong> Held temporary work or study permit during work term.</li>
            <li><strong>Benefit:</strong> Faster processing (~6 months), no job offer required.</li>
        </ul>
    </div>),
    "fstp": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Federal Skilled Trades Program (FSTP)</h2>
        <p className="mb-4">
            A route for qualified tradespeople to gain Canadian PR.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Work Experience:</strong> ≥2 years full-time in a skilled trade (NOC TEER B) within last 5 years.</li>
            <li><strong>Job Offer/Certification:</strong> Valid 1-year job offer from a Canadian employer or provincial certificate of qualification.</li>
            <li><strong>Language:</strong> CLB 5 (speaking/listening) &amp; CLB 4 (reading/writing).</li>
            <li><strong>Common Trades:</strong> Electricians, welders, plumbers, chefs, heavy-equipment operators, etc.</li>
        </ul>
    </div>),
    "pnp": (
        <div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Provincial Nominee Program (PNP)</h2>
            <p className="mb-4">
                Provinces/territories nominate candidates with skills matching local labour needs.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Streams:</strong> Each province has its own (e.g., Ontario HCP, BC Tech) targeting specific occupations.</li>
                <li><strong>Eligibility:</strong> Varies but generally requires relevant experience or a job offer, language proficiency, and intent to reside in the province.</li>
                <li><strong>Enhanced PNP:</strong> Use Express Entry → nomination adds 600 CRS points → ITA.</li>
                <li><strong>Base PNP:</strong> Apply directly to province → separate PR application → longer processing.</li>
            </ul>
        </div>
    ),
    "French-language proficiency": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">French Language Proficiency</h2>
        <p className="mb-4">
            Earn points as a second official language using TEF/TCF exams.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>CLB Levels:</strong> CLB 5–6 earns 1–3 points per ability; CLB 7+ earns up to 6 points per ability.</li>
            <li><strong>Bilingualism Bonus:</strong> Up to 50 extra CRS points if you score CLB 7+ in both English & French.</li>
            <li><strong>Test Options:</strong> TEF Canada, TCF Canada, or NCLC assessments for Quebec programs.</li>
        </ul>
    </div>),
    "Healthcare and social services occupations": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Healthcare & Social Services</h2>
        <p className="mb-4">
            To be eligible, you must meet Express Entry’s minimum criteria and:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Have ≥6 months of full-time (or equivalent part-time) work in a single listed healthcare or social-services occupation within the last 3 years (in Canada or abroad).</li>
            <li>Hold any required professional credentials or licences.</li>
            <li>Follow all round-specific instructions.</li>
        </ul>
    </div>),
    "Science, Technology, Engineering and Math (STEM) occupations": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">STEM Occupations</h2>
        <p className="mb-4">
            To be eligible, you must meet Express Entry’s minimum criteria and:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Have ≥6 months of full-time (or equivalent part-time) work in a single listed STEM occupation within the last 3 years (in Canada or abroad).</li>
            <li>Possess any required certifications or degrees.</li>
            <li>Adhere to the specific round instructions.</li>
        </ul>
    </div>),
    "Trade occupations": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Trade Occupations</h2>
        <p className="mb-4">
            To be eligible, you must meet Express Entry’s minimum criteria and:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Have ≥6 months of full-time (or equivalent part-time) work in a single listed trade occupation within the last 3 years (in Canada or abroad).</li>
            <li>Hold any required certifications or provincial trade certificates.</li>
            <li>Meet all round-specific requirements.</li>
        </ul>
    </div>),
    "Agriculture and agri-food occupations": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Agriculture & Agri-Food</h2>
        <p className="mb-4">
            To be eligible, you must meet Express Entry’s minimum criteria and:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Have ≥6 months of full-time (or equivalent part-time) work in a single listed agriculture or agri-food occupation within the last 3 years (in Canada or abroad).</li>
            <li>Possess any required certifications or licences.</li>
            <li>Follow all round-specific instructions.</li>
        </ul>
    </div>),
    "Education occupations": (<div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Education Occupations</h2>
        <p className="mb-4">
            To be eligible, you must meet Express Entry’s minimum criteria and:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Have ≥6 months of full-time (or equivalent part-time) work in a single listed education occupation within the last 3 years (in Canada or abroad).</li>
            <li>Hold any required teaching certifications or licences.</li>
            <li>Comply with all round-specific requirements.</li>
        </ul>
    </div>),

}


interface PNPAssessment {
    id?: string;
    province: string;
    stream_name: string;
    status: string;
    reason: string;
}

interface PNPOption {
    id: string;
    province: string;
    stream_name: string;
    status: string;
    reason: string;
    selected: boolean;
}

export default function Report() {

    const router = useRouter();
    const { userProfile } = useUserStore();
    const { isComplete, basicInfo } = userProfile;
    const reportContentRef = useRef(null);

    const [showPNPOptionsDialog, setShowPNPOptionsDialog] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAlternativePathwaysDialog, setShowAlternativePathwaysDialog] = useState(false);
    const [selectedPNPOption, setSelectedPNPOption] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showChatBox, setShowChatBox] = useState(false);
    const [regenerateReport, setRegenerateReport] = useState(false);
    const [consultant, setConsultant] = useState<Consultant[] | null>(null);

    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [infoName, setInfoName] = useState<string | null>(null);
    // const [isConsultancyLoading, setIsConsultancyLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // const pnpReport = usePNPStore.getState().report;
    const eligiblePrograms = usePNPStore.getState().eligiblePrograms;
    // const isLoading = useExpressEntryStore((state) => state.isLoading);  
    const expressEntryProfile = useExpressEntryStore((state) => state.profile);
    const expressEntryRecommendations = useRecommendationStore((state) => state.recommendations);
    // Use the useReportData hook to handle fetching both Express Entry and PNP data

    // TODO: user ReportData hook for production, for testing of new feature we have commented it out
    const { isLoading, error, setError } = useReportData(regenerateReport, setRegenerateReport);

    // TODO: remove this for production
    // const isLoading = false;
    // const error = null;
    // const setError = (arg0: any) => {};

    const isConsultationDialogOpen = useAuthStore((state) => state.isConsultationDialogOpen);

    React.useEffect(() => {

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!isComplete) {
            router.push('/profile');
        }

        const fetchConsultant = () => {
            // const consultant = ConsultantFakeData.find((c) => c.serviceAreas.includes(basicInfo.province!));
            const consultant = ConsultantFakeData.filter((c) => c.serviceAreas.includes('British Columbia'))!.slice(0, 2);
            console.log(consultant);
            setConsultant(consultant);
        }

        fetchConsultant();

    }, [isComplete]);

    const handlePNPOptionSelect = (optionId: string) => {
        setSelectedPNPOption(optionId);
        // You can add additional logic here when an option is selected
    };

    const transformPNPOptions = (assessments: PNPAssessment[]): PNPOption[] => {
        const assessmentOptions = assessments.map((assessment, index) => ({
            id: assessment.id || `pnp-${index}`,
            province: assessment.province,
            stream_name: assessment.stream_name,
            status: assessment.status,
            reason: assessment.reason,
            selected: selectedPNPOption === (assessment.id || `pnp-${index}`)
        }));

        const eligiblePrograms = assessmentOptions.filter((option) => option.status === 'Eligible');
        const ineligiblePrograms = assessmentOptions.filter((option) => option.status === 'Ineligible');

        return [...eligiblePrograms, ...ineligiblePrograms];
    };

    const downloadReport = async () => {
        setIsDownloading(true);
        console.log('Downloading report...');
        try {
            // Get the report content using the ref instead of getElementById
            const reportContent = reportContentRef.current;

            if (!reportContent) {
                console.error('Report content not found');
                setIsDownloading(false);
                return;
            }

            // Create a new PDF document
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Add title page
            pdf.setFontSize(24);
            pdf.setTextColor(33, 33, 33);
            pdf.text('Immigration Pathway Report', 105, 50, { align: 'center' });
            pdf.setFontSize(14);
            pdf.text(`For: ${basicInfo.fullName || 'User'}`, 105, 65, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text(`Generated on: ${new Date().toLocaleDateString('en-CA')}`, 105, 75, { align: 'center' });

            // Add logo placeholder
            pdf.setFillColor(230, 244, 255);
            pdf.rect(65, 100, 80, 30, 'F');
            pdf.setTextColor(30, 64, 175);
            pdf.setFontSize(16);
            pdf.text('PATHWAY FINDER', 105, 115, { align: 'center' });
            pdf.setFontSize(10);
            pdf.text('Your Immigration Journey Simplified', 105, 122, { align: 'center' });

            pdf.addPage();
            // Get each section of the report that we want to include
            const reportSections = (reportContent as HTMLElement).querySelectorAll('.pdf-section') || [];

            // If no sections with the pdf-section class are found, try to convert the entire reportContent
            if (reportSections.length === 0) {
                console.log('No sections found, using entire report content');
                try {
                    // Convert entire report content
                    const canvas = await html2canvas(reportContent, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        allowTaint: true
                    });

                    // Calculate dimensions to fit on PDF
                    const imgWidth = 190;
                    const imgHeight = canvas.height * imgWidth / canvas.width;

                    // Add content
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, imgHeight);
                } catch (error) {
                    console.error('Error converting entire report content:', error);
                }
            } else {
                console.log(`Found ${reportSections.length} sections`);
                let yOffset = 15;

                // Add each section to PDF
                for (let i = 0; i < reportSections.length; i++) {
                    const section = reportSections[i];

                    if (i > 0 && yOffset > 250) {
                        // Add a new page if we're running out of space
                        pdf.addPage();
                        yOffset = 15;
                    }

                    // Convert section to canvas
                    const canvas = await html2canvas(section as HTMLElement, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        allowTaint: true
                    });

                    // Calculate dimensions to fit on PDF
                    const imgWidth = 190;
                    const imgHeight = canvas.height * imgWidth / canvas.width;

                    // Add section title
                    const sectionTitle = section.getAttribute('data-title');
                    if (sectionTitle) {
                        pdf.setFontSize(14);
                        pdf.setTextColor(30, 64, 175);
                        pdf.text(sectionTitle, 10, yOffset);
                        yOffset += 8;
                    }

                    // Add section content
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);

                    yOffset += imgHeight + 15;

                    // Add page break if not the last section
                    if (i < reportSections.length - 1 && yOffset > 250) {
                        pdf.addPage();
                        yOffset = 15;
                    }
                }
            }

            // Save the PDF
            pdf.save(`Immigration_Pathway_Report_${basicInfo.fullName || 'User'}_${new Date().toLocaleDateString('en-CA')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again later.');
        } finally {
            setIsDownloading(false);
        }
    };


    async function handleConsultationRequest() {
        try {
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
        <>
            {/* <Helmet>
                <title>CRS Score & Eligibility Report | Pathpr</title>
                <meta name="description" content="View your personalized CRS score breakdown, PNP eligibility, and expert recommendations to improve your chances." />
                <meta property="og:title" content="CRS Report and Recommendations | Pathpr" />
                <meta property="og:description" content="Discover your immigration program eligibility and learn actionable steps to enhance your CRS profile." />
                <meta property="og:url" content="https://pathpr.ca/report" />
            </Helmet> */}

            <Layout>
                <div className={`py-8 bg-white mt-16 border-b border-secondary-200 ${showChatBox ? 'blur' : ''}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex flex-col w-full">
                                <h1 className="text-2xl font-bold text-secondary-900 sm:text-3xl">
                                    Your Immigration Pathway Report
                                </h1>
                                <p className="mt-2 text-sm text-secondary-500">
                                    Last updated: {new Date().toLocaleDateString('en-CA')}
                                </p>
                            </div>
                            <div className="mt-5 flex flex-col md:flex-row md:mt-0 md:ml-4 space-y-3 md:space-y-0 md:space-x-3 w-full">
                                <button
                                    // variant="outline"
                                    onClick={downloadReport}
                                    disabled={true}
                                    // leftIcon={<Download className="h-4 w-4" />}
                                    className='w-full md:w-auto bg-white text-secondary-950 border border-secondary-950 disabled:opacity-50 disabled:cursor-not-allowed rounded-md px-4'
                                >
                                    Download Report
                                </button>

                                <Button
                                    leftIcon={<Edit className="h-4 w-4" />}
                                    onClick={() => router.push('/profile')}
                                    variant="outline"
                                    className="w-full md:w-auto bg-secondary-950 text-white hover:bg-secondary-950 hover:text-white"
                                >
                                    Update Profile
                                </Button>

                                <Button
                                    leftIcon={<Edit className="h-4 w-4" />}
                                    onClick={() => setRegenerateReport(true)}
                                    variant="outline"
                                    className="w-full md:w-auto bg-white text-secondary-950 border border-secondary-950 hover:bg-white hover:text-secondary-950"
                                >
                                    Re-Generate Report
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>

                {isLoading ? <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary-50 h-[70vh] flex items-center justify-center"><LoadingSpinner size='large' message='Loading Report...' /></div>
                    :
                    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${showChatBox ? 'blur-sm' : ''}`} ref={reportContentRef}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {isLoading ? <div className="w-96 mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary-50"><LoadingSpinner /></div> : <div className="lg:col-span-2 space-y-8">
                                <Card className="pdf-section" data-title="Express Entry Profile">
                                    <CardHeader className="bg-secondary-100">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-xl">Express Entry Profile</CardTitle>
                                            <div className="bg-primary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                Primary Recommendation
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">Comprehensive Ranking System (CRS) Score
                                                        <Info
                                                            onClick={() => {
                                                                setInfoName('crs')
                                                                setShowInfoDialog(true)
                                                            }}
                                                            className="w-4 h-4 cursor-pointer " />
                                                    </h3>
                                                    <p className="text-secondary-600 text-sm">Based on your profile information</p>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-secondary-950">{expressEntryProfile?.expressEntryProfile?.crsScore}</div>
                                                    {/* <div className="text-2xl font-bold text-secondary-950">{expressEntryProfile?.expressEntryProfile?.crsScore !== 0 ? expressEntryProfile?.expressEntryProfile?.crsScore! - 10 : 0} - {expressEntryProfile?.expressEntryProfile?.crsScore! + 10}</div> */}
                                                    <div className="text-xs text-secondary-500">points</div>
                                                </div>
                                            </div>

                                            <div className="border-t border-secondary-200 pt-4">
                                                <h4 className="font-medium text-secondary-900 mb-3 underline">Score Breakdown</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                                                            <h4 className="text-sm font-medium">Core/Human Capital Factors:</h4>
                                                            {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.coreHumanCapital?.reason?.map((bd, idx) =>
                                                                <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium whitespace-nowrap">
                                                            {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.coreHumanCapital?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.coreHumanCapital?.maximum}
                                                        </span>
                                                    </div>

                                                    <hr className="my-2" />

                                                    <div className="flex justify-between items-center flex-wrap">
                                                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                                                            <h4 className="text-sm font-medium">Spouse Factors : </h4>
                                                            {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.spouseFactors?.reason?.map((bd, idx) =>
                                                                <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium">{expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.spouseFactors?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.spouseFactors?.maximum}</span>
                                                    </div>

                                                    <hr className="my-2" />

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                                                            <h4 className="text-sm font-medium">Skill Transferability : </h4>
                                                            {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.skillTransferability?.reason?.map((bd, idx) =>
                                                                <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium">{expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.skillTransferability?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.skillTransferability?.maximum}</span>
                                                    </div>

                                                    <hr className="my-2" />

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                                                            <h4 className="text-sm font-medium">Additional Points : </h4>
                                                            {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.additionalPoints?.reason?.map((bd, idx) =>
                                                                <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium">{expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.additionalPoints?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.additionalPoints?.maximum}</span>

                                                    </div>
                                                </div>
                                            </div>


                                            <div className="border-t border-secondary-200 pt-4">
                                                <h4 className="font-medium text-secondary-900 mb-2 underline">Eligibility Status</h4>
                                                <div className="flex items-start mt-2">
                                                    <div className="flex-shrink-0">
                                                        {expressEntryProfile?.eligibilityStatus[0]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                                    </div>
                                                    <div className="ml-3">
                                                        <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                                                            {expressEntryProfile?.eligibilityStatus[0]?.program}
                                                            <Info 
                                                                onClick={() => {
                                                                    setInfoName('fswp')
                                                                    setShowInfoDialog(true)
                                                                }}
                                                                className="w-4 h-4 cursor-pointer " /> <span className="text-xs text-secondary-600">Click to learn more</span>
                                                        </h5>
                                                        {expressEntryProfile?.eligibilityStatus[0]?.reason?.map((bd, idx) =>
                                                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-start mt-4">
                                                    <div className="flex-shrink-0">
                                                        {expressEntryProfile?.eligibilityStatus[1]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                                    </div>
                                                    <div className="ml-3">
                                                        <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                                                            {expressEntryProfile?.eligibilityStatus[1]?.program}
                                                            <Info
                                                                onClick={() => {
                                                                    setInfoName('cec')
                                                                    setShowInfoDialog(true)
                                                                }}
                                                                className="w-4 h-4 cursor-pointer " />
                                                        </h5>
                                                        {expressEntryProfile?.eligibilityStatus[1]?.reason?.map((bd, idx) =>
                                                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-start mt-4">
                                                    <div className="flex-shrink-0">
                                                        {expressEntryProfile?.eligibilityStatus[2]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                                    </div>
                                                    <div className="ml-3">
                                                        <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                                                            {expressEntryProfile?.eligibilityStatus[2]?.program}
                                                            <Info
                                                                onClick={() => {
                                                                    setInfoName('fstp')
                                                                    setShowInfoDialog(true)
                                                                }}
                                                                className="w-4 h-4 cursor-pointer " />
                                                        </h5>
                                                        {expressEntryProfile?.eligibilityStatus[2]?.reason?.map((bd, idx) =>
                                                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-secondary-200 pt-4">
                                                <h4 className="font-medium text-secondary-900 mb-2 underline">Category-Based Eligibility</h4>

                                                {expressEntryProfile?.categoryBasedEligibility.map((eligibility, index) => (
                                                    <div
                                                        key={`eligibility-${index}`}
                                                        className="flex items-start mt-2"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            {eligibility.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                                        </div>
                                                        <div className="ml-3">
                                                            <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                                                                {eligibility.program}
                                                                <Info
                                                                    onClick={() => {
                                                                        setInfoName(eligibility.program)
                                                                        setShowInfoDialog(true)
                                                                    }}
                                                                    className="w-4 h-4 cursor-pointer " />
                                                            </h5>
                                                            <p className="text-sm text-secondary-600">
                                                                {eligibility.reason}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* <div className="flex items-start mt-2">
                        <div className="flex-shrink-0">
                          {expressEntryProfile?.categoryBasedEligibility[0].isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            {expressEntryProfile?.categoryBasedEligibility[0].program}
                          </h5>
                          <p className="text-sm text-secondary-600">
                            {expressEntryProfile?.categoryBasedEligibility[0]?.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mt-4">
                        <div className="flex-shrink-0">
                          {expressEntryProfile?.categoryBasedEligibility[1].isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            {expressEntryProfile?.categoryBasedEligibility[1]?.program}
                          </h5>
                          <p className="text-sm text-secondary-600">
                            {expressEntryProfile?.categoryBasedEligibility[1]?.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mt-4">
                        <div className="flex-shrink-0">
                          {expressEntryProfile?.categoryBasedEligibility[2].isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            {expressEntryProfile?.categoryBasedEligibility[2]?.program}
                          </h5>
                          <p className="text-sm text-secondary-600">
                            {expressEntryProfile?.categoryBasedEligibility[2]?.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mt-4">
                        <div className="flex-shrink-0">
                          {expressEntryProfile?.categoryBasedEligibility[3].isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            {expressEntryProfile?.categoryBasedEligibility[3].program}
                          </h5>
                          <p className="text-sm text-secondary-600">
                            {expressEntryProfile?.categoryBasedEligibility[3].details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mt-4">
                        <div className="flex-shrink-0">
                            {expressEntryProfile?.categoryBasedEligibility[4].isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                              {expressEntryProfile?.categoryBasedEligibility[4]?.program}
                          </h5>
                          <p className="text-sm text-secondary-600">
                              {expressEntryProfile?.categoryBasedEligibility[4]?.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mt-4">
                        <div className="flex-shrink-0">
                          {expressEntryProfile?.categoryBasedEligibility[5]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            {expressEntryProfile?.categoryBasedEligibility[5]?.program}
                          </h5>
                          <p className="text-sm text-secondary-600">
                            {expressEntryProfile?.categoryBasedEligibility[5]?.details}
                          </p>
                        </div>
                      </div>
                    </div> */}

                                                {/* <div className="border-t border-secondary-200 pt-4">
                      <h4 className="font-medium text-secondary-900 mb-3">Recent Draw Information</h4>
                      <p className="text-sm text-secondary-600 mb-2">
                        Based on recent Express Entry draws, your score of <span className="font-medium">{useExpressEntryStore.getState().profile?.crsScore}</span> would have been:
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              {useExpressEntryStore.getState().profile?.eligibilityStatus[2].details}
                            </p>
                          </div>
                        </div>
                      </div> */}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-primary-50">
                                        <div className="w-full flex justify-between items-center">
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://ircc.canada.ca/english/immigrate/skilled/crs-tool.asp
  "
                                                className="text-secondary-900 hover:text-secondary-950 text-sm font-medium flex items-center"
                                            >
                                                Learn more about Express Entry
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                            {/* <Button size="sm">
                      Improve Your Score
                    </Button> */}
                                        </div>
                                    </CardFooter>
                                </Card>

                                {isLoading ? <div className="w-96 mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary-50"><LoadingSpinner /></div>
                                    :
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className='flex flex-col gap-2 justify-between pdf-section' data-title="Provincial Nominee Program">
                                            <CardHeader>
                                                <CardTitle className='flex items-center gap-2'>Provincial Nominee Program
                                                    <Info 
                                                        onClick={() => {
                                                            setInfoName('pnp')
                                                            setShowInfoDialog(true)
                                                        }}
                                                        className="w-4 h-4 cursor-pointer " />
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent >
                                                <div className="space-y-4">
                                                    {eligiblePrograms?.length === 0 &&
                                                        <div>
                                                            <h4 className="text-sm font-medium text-yellow-500 mb-2">Since you are not eligible for any PNP, here are some suggestions:</h4>
                                                            {usePNPStore.getState().report?.suggestions?.slice(0, 3).map((suggestion, index) => (
                                                                <div key={`pnp-suggestion-${index}`} className="flex items-start">
                                                                    <div key={`pnp-suggestion-${index}`} className="flex items-start">
                                                                        <div className="flex-shrink-0 w-full">
                                                                            <h3 className="text-sm font-medium text-secondary-900">{suggestion.action}</h3>
                                                                            <p className="text-sm text-secondary-600">{suggestion.reason}</p>
                                                                            {index !== 2 && <hr className="my-2" />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                    {eligiblePrograms?.slice(0,3)?.map((program, index) => (
                                                        <div key={`pnp-${index}`} className="flex items-start">
                                                            <div className="flex-shrink-0">
                                                                {program.status === 'Eligible' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                                            </div>
                                                            <div className="ml-3">
                                                                <h3>{program.province}</h3>
                                                                <h5 className="text-sm font-medium text-secondary-900">
                                                                    {program.stream_name}
                                                                </h5>
                                                                <p className="text-sm text-secondary-600">
                                                                    {program.reason}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {eligiblePrograms && eligiblePrograms?.length > 3 && ( <p className="text-sm italic text-secondary-600">You are eligible for total of {eligiblePrograms?.length} PNP programs. Click on the button below to view all options.</p>)}
                                                    
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-col gap-2">
                                                <Button
                                                    onClick={() => setShowPNPOptionsDialog(true)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    View All PNP Options
                                                </Button>
                                                <Button
                                                    onClick={() => setShowSuggestions(true)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Show PNP Suggestions
                                                </Button>
                                            </CardFooter>
                                        </Card>

                                        <Card className='pdf-section flex flex-col gap-2 justify-between' data-title="Alternative Pathways">
                                            <CardHeader>
                                                <CardTitle>Alternative Pathways</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">


                                                    {alternativePrograms.slice(0, 3).map((program, idx) => (
                                                        <div
                                                            key={`alternative-${idx}`}
                                                            className="flex items-start"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                {program.status === 'Active' ? <CheckCircle className="h-5 w-5 text-green-500" /> : program.status === 'Temporarily Paused' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
                                                            </div>
                                                            <div className="ml-3">
                                                                <h5 className="text-sm font-medium text-secondary-900">
                                                                    {program.title}
                                                                </h5>
                                                                <p className={`text-sm text-secondary-600 ${program.status === 'Active' ? 'text-green-400' : program.status === 'Temporarily Paused' ? 'text-yellow-500' : 'text-red-900'}`}>
                                                                    {program.status}
                                                                </p>
                                                                <p className="text-sm text-secondary-600">
                                                                    {program.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    ))}


                                                    {/* <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            Rural and Northern Immigration Pilot
                          </h5>
                          <p className="text-sm text-secondary-600">
                            Requires job offer in participating community
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900">
                            Start-up Visa Program
                          </h5>
                          <p className="text-sm text-secondary-600">
                            Requires business concept and support from designated organization
                          </p>
                        </div>
                      </div> */}
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button
                                                    onClick={() => setShowAlternativePathwaysDialog(true)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Explore All Alternative Pathways
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>}

                                <Card className='pdf-section' data-title="Next Steps and Recommendations">
                                    <CardHeader>
                                        <CardTitle>Next Steps and Recommendations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-medium text-secondary-900 mb-3">Improve Your CRS Score</h4>
                                                <ul className="space-y-3">

                                                    {!isLoading && expressEntryRecommendations?.map((recommendation, index) => (
                                                        <li
                                                            key={`recommendation-${index}`}
                                                            className="flex items-start"
                                                        >
                                                            <div className="flex-shrink-0 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-secondary-600">
                                                                <span className="font-medium text-secondary-900">{recommendation.question}</span> {recommendation.answer}
                                                            </p>
                                                        </li>
                                                    ))}

                                                    {/* <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5">
                            2
                          </div>
                          <p className="text-secondary-600">
                            <span className="font-medium text-secondary-900">Obtain a Canadian job offer:</span> A valid job offer with LMIA can add 50-200 points depending on the NOC code.
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5">
                            3
                          </div>
                          <p className="text-secondary-600">
                            <span className="font-medium text-secondary-900">Provincial nomination:</span> Actively pursue provincial nomination, which adds 600 points to your CRS score.
                          </p>
                        </li> */}
                                                </ul>
                                            </div>

                                            <div className="border-t border-secondary-200 pt-4">
                                                <h4 className="font-medium text-secondary-900 mb-3">Required Documents</h4>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center">
                                                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                                                        <span className="text-secondary-600">Valid passport</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                                                        <span className="text-secondary-600">Language test results (IELTS, CELPIP, or TEF)</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                                                        <span className="text-secondary-600">Educational Credential Assessment (ECA)</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                                                        <span className="text-secondary-600">Proof of funds</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                                                        <span className="text-secondary-600">Police clearance certificates</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                                                        <span className="text-secondary-600">Medical examination results</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="border-t border-secondary-200 pt-4">
                                                <h4 className="font-medium text-secondary-900 mb-3">Timeline Estimate</h4>
                                                <div className="bg-primary-50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-secondary-900">Express Entry Profile Submission</span>
                                                        <span className="text-sm text-secondary-600">May 2025</span>
                                                    </div>
                                                    <div className="w-full bg-white rounded-full h-2.5 mb-6">
                                                        <div className="bg-primary-600 h-2.5 rounded-full w-[10%]"></div>
                                                    </div>

                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-secondary-900">Invitation to Apply (Estimated)</span>
                                                        <span className="text-sm text-secondary-600">July-Sep 2025</span>
                                                    </div>
                                                    <div className="w-full bg-white rounded-full h-2.5 mb-6">
                                                        <div className="bg-primary-600 h-2.5 rounded-full w-[30%]"></div>
                                                    </div>

                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-secondary-900">Application Processing</span>
                                                        <span className="text-sm text-secondary-600">6-9 months</span>
                                                    </div>
                                                    <div className="w-full bg-white rounded-full h-2.5 mb-6">
                                                        <div className="bg-primary-600 h-2.5 rounded-full w-[75%]"></div>
                                                    </div>

                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-secondary-900">Permanent Residence (Estimated)</span>
                                                        <span className="text-sm text-secondary-600">Q2-Q3 2026</span>
                                                    </div>
                                                    <div className="w-full bg-white rounded-full h-2.5">
                                                        <div className="bg-primary-600 h-2.5 rounded-full w-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <p className="text-sm text-secondary-600 italic">
                                    Disclaimer: These results are not immigration advice. If you want to learn more about the program, review the resources below.
                                </p>
                                <Link className="text-sm text-secondary-600 flex gap-1 hover:underline" href={"/resources"}><ExternalLink className="w-4 h-4" />View Resources</Link>
                            </div>}

                            <div className="lg:col-span-1 space-y-6">
                                {/* <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-secondary-500">Name</h4>
                      <p className="text-secondary-900">{basicInfo.fullName || 'John Doe'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-500">Age</h4>
                      <p className="text-secondary-900">{basicInfo.age || '32'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-500">Country of Citizenship</h4>
                      <p className="text-secondary-900">{basicInfo.citizenCountry.charAt(0).toUpperCase() + basicInfo.citizenCountry.slice(1) || 'India'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-500">Education</h4>
                      <p className="text-secondary-900">{useUserStore.getState().userProfile?.educationInfo.educationList[0]?.type || 'Master\'s Degree'}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/profile')}
                    >
                      View/Edit Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

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
                                                onClick={() => setShowChatBox(true)}
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
                                                // onClick={() => navigate('/consultants')}
                                                size="sm" className="w-full bg-secondary-900 text-white hover:bg-secondary-950">
                                                Book Consultation
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* <Card>
              <CardHeader >
                    <CardTitle>Verified Consultants Available In Your Province    

                    </CardTitle>
              </CardHeader>
              <CardContent>
                {consultant && consultant.length > 0 && consultant.map((c) => (
                  <ConsultantCard consultant={c} className="bg-white hover:translate-y-0 mx-1 my-2 hover:shadow-md"/>
                ))}
                    <Link className='text-secondary-600 ml-4 text-sm flex font-normal justify-end items-center hover:underline' to={"/consultants"}><ExternalLink className="w-4 h-4" />View All</Link>
              </CardContent>
            </Card> */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Draws</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-full flex flex-col shadow-xl rounded-lg">
                                            <div className="flex-grow bg-secondary-50 rounded-lg p-6 border border-secondary-100 h-full">
                                                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Recent Draws</h3>
                                                <p className="text-secondary-700 mb-4">
                                                    Latest invitation rounds for Canada's immigration programs.
                                                </p>
                                                <div className="space-y-4">
                                                    <div
                                                        onClick={() => window.open("https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=345", "_blank", "noopener,noreferrer")}
                                                        className="border-b border-secondary-200 pb-1 cursor-pointer hover:bg-secondary-200 transition-all duration-300 rounded-md hover:px-2 hover:py-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium text-secondary-800">Express Entry</div>
                                                                <p className="text-secondary-600">Healthcare And Social Services Occupations</p>
                                                            </div>
                                                            <div className="text-sm text-secondary-500">May 02, 2025</div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-sm text-secondary-600">500 invitations</div>
                                                            <div className="text-sm font-medium bg-secondary-100 text-secondary-800 px-2 py-1 rounded">CRS: 510</div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        onClick={() => window.open("https://immigratemanitoba.com/2025/05/eoi-draw-244/", "_blank", "noopener,noreferrer")}
                                                        className="border-b border-secondary-200 pb-1 cursor-pointer hover:bg-secondary-200 transition-all duration-300 rounded-md hover:px-2 hover:py-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium text-secondary-800">Manitoba PNP</div>
                                                                <p className="text-secondary-600">Skilled Workers Overseas</p>
                                                            </div>
                                                            <div className="text-sm text-secondary-500">May 01, 2025</div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-sm text-secondary-600">26 invitations</div>
                                                            <div className="text-sm font-medium bg-secondary-100 text-secondary-800 px-2 py-1 rounded">Score: 727</div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        onClick={() => window.open("https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=344", "_blank", "noopener,noreferrer")}
                                                        className="border-b border-secondary-200 pb-1 cursor-pointer hover:bg-secondary-200 transition-all duration-300 rounded-md hover:px-2 hover:py-1"
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium text-secondary-800">Express Entry</div>
                                                                <p className="text-secondary-600">Education Occupations</p>
                                                            </div>
                                                            <div className="text-sm text-secondary-500">May 01, 2025</div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-sm text-secondary-600">1,000 invitations</div>
                                                            <div className="text-sm font-medium bg-secondary-100 text-secondary-800 px-2 py-1 rounded">CRS: 479</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>}
                <PNPOptionsDialog
                    isOpen={showPNPOptionsDialog}
                    onClose={() => setShowPNPOptionsDialog(false)}
                    options={transformPNPOptions(usePNPStore.getState().report?.pnpAssessment || [])}
                    onOptionSelect={handlePNPOptionSelect}
                />
                <SuggestionsDialog
                    isOpen={showSuggestions}
                    onClose={() => setShowSuggestions(false)}
                    options={usePNPStore.getState().report?.suggestions || []}
                    onOptionSelect={() => { }}
                />
                <AlternativePathwaysDialog
                    isOpen={showAlternativePathwaysDialog}
                    onClose={() => setShowAlternativePathwaysDialog(false)}
                    options={alternativePrograms}
                    onOptionSelect={() => { }}
                />
                <ChatBox
                    isOpen={showChatBox}
                    onClose={() => setShowChatBox(false)}
                />
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

                <MessagePopup
                    isOpen={error !== null}
                    onClose={() => setError(null)}
                    title="Error"
                    message={error || 'An error occurred. Please try again.'}
                    type="error"
                    cancelText="Close"
                />

                <MessagePopup
                    isOpen={showInfoDialog}
                    onClose={() => setShowInfoDialog(false)}
                    cancelText="Close"
                    illustration={infoDialogData[infoName as keyof typeof infoDialogData]}
                    maxWidth='2xl'
                    
                />

            </Layout>
        </>
    );
}


// import React, { useEffect, useRef, useState } from 'react';

// import { useNavigate } from 'react-router-dom';
// import { useUserStore } from '../store/userStore';
// import Layout from '../components/layout/Layout';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import {
//   Download,
//   MessageCircle,
//   Edit,
//   ExternalLink,
//   Clipboard,
//   CheckCircle,
//   AlertTriangle,
//   ChevronRight,
//   Loader2,
//   RefreshCw
// } from 'lucide-react';
// import useAuthStore from '../store/authStore';
// import api from '../utils/axios';
// import { useExpressEntryStore, useRecommendationStore } from '../store/reports';
// import { usePNPStore } from '../store/reports';

// import { useReportData } from '../hooks/useReportData';
// import LoadingSpinner from '../components/ui/LoadinSpinner';
// import { PNPOptionsDialog } from '../components/PNPOptionsDialog';
// import { SuggestionsDialog } from '../components/SuggestionsDialog';
// import { alternativePrograms } from '../utils/dummyData';
// import { AlternativePathwaysDialog } from '../components/AlternativePathwaysDialog';

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import ChatBox from '../components/ui/ChatBox';
// import { MessagePopup } from '../components/ui/MessagePopup';

// interface PNPAssessment {
//   id?: string;
//   province: string;
//   stream_name: string;
//   status: string;
//   reason: string;
// }

// interface PNPOption {
//   id: string;
//   province: string;
//   stream_name: string;
//   status: string;
//   reason: string;
//   selected: boolean;
// }

// export default function Report() {
//   const navigate = useNavigate();
//   const { userProfile } = useUserStore();
//   const { isComplete, basicInfo } = userProfile;
//   const reportContentRef = useRef(null);

//   const [showPNPOptionsDialog, setShowPNPOptionsDialog] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showAlternativePathwaysDialog, setShowAlternativePathwaysDialog] = useState(false);
//   const [selectedPNPOption, setSelectedPNPOption] = useState<string | null>(null);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [showChatBox, setShowChatBox] = useState(false);
//   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
//   const [msg, setMsg] = useState('');

//   const eligiblePrograms = usePNPStore.getState().eligiblePrograms;
//   const expressEntryProfile = useExpressEntryStore((state) => state.profile);
//   const expressEntryRecommendations = useRecommendationStore((state) => state.recommendations);

//   // Use the useReportData hook to handle fetching both Express Entry and PNP data
//   const { isLoading, refetch } = useReportData();

//   const isConsultationDialogOpen = useAuthStore((state) => state.isConsultationDialogOpen);

//   useEffect(() => {
//     if (!isComplete || !basicInfo.fullName) {
//       navigate('/profile');
//     }
//   }, [isComplete, basicInfo.fullName, navigate]);

//   const handlePNPOptionSelect = (optionId: string) => {
//     setSelectedPNPOption(optionId);
//     // You can add additional logic here when an option is selected
//   };

//   const transformPNPOptions = (assessments: PNPAssessment[]): PNPOption[] => {
//     return assessments.map((assessment, index) => ({
//       id: assessment.id || `pnp-${index}`,
//       province: assessment.province,
//       stream_name: assessment.stream_name,
//       status: assessment.status,
//       reason: assessment.reason,
//       selected: selectedPNPOption === (assessment.id || `pnp-${index}`)
//     }));
//   };

//   async function generateReport() {
//     setIsGeneratingReport(true);
//     try {
//       const response = await api.get(`/report/recommendation/${useAuthStore.getState().user?._id}`);
//       if (response.status === 200) {
//         await refetch();
//         setMsg('Report generated successfully!');
//         useAuthStore.getState().setIsConsultationDialogOpen(true);
//         setTimeout(() => {
//           useAuthStore.getState().setIsConsultationDialogOpen(false);
//           setMsg('');
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Error generating report:', error);
//       setMsg('Error generating report. Please try again.');
//       useAuthStore.getState().setIsConsultationDialogOpen(true);
//       setTimeout(() => {
//         useAuthStore.getState().setIsConsultationDialogOpen(false);
//         setMsg('');
//       }, 3000);
//     } finally {
//       setIsGeneratingReport(false);
//     }
//   }

//   const downloadReport = async () => {
//     setIsDownloading(true);

//     try {
//       // Get the report content using the ref
//       const reportContent = reportContentRef.current;

//       if (!reportContent) {
//         console.error('Report content not found');
//         setIsDownloading(false);
//         return;
//       }

//       // Create a new PDF document
//       const pdf = new jsPDF('p', 'mm', 'a4');

//       // Add title page
//       pdf.setFontSize(24);
//       pdf.setTextColor(33, 33, 33);
//       pdf.text('Immigration Pathway Report', 105, 50, { align: 'center' });
//       pdf.setFontSize(14);
//       pdf.text(`For: ${basicInfo.fullName || 'User'}`, 105, 65, { align: 'center' });
//       pdf.setFontSize(12);
//       pdf.text(`Generated on: ${new Date().toLocaleDateString('en-CA')}`, 105, 75, { align: 'center' });

//       // Add logo placeholder
//       pdf.setFillColor(230, 244, 255);
//       pdf.rect(65, 100, 80, 30, 'F');
//       pdf.setTextColor(30, 64, 175);
//       pdf.setFontSize(16);
//       pdf.text('PATHWAY FINDER', 105, 115, { align: 'center' });
//       pdf.setFontSize(10);
//       pdf.text('Your Immigration Journey Simplified', 105, 122, { align: 'center' });

//       pdf.addPage();

//       // Get each section of the report that we want to include
//       const reportSections = (reportContent as HTMLElement).querySelectorAll('.pdf-section') || [];

//       if (reportSections.length === 0) {
//         // Convert entire report content if no pdf-section classes found
//         const canvas = await html2canvas(reportContent, {
//           scale: 2,
//           useCORS: true,
//           logging: false,
//           allowTaint: true
//         });

//         // Calculate dimensions to fit on PDF
//         const imgWidth = 190;
//         const imgHeight = canvas.height * imgWidth / canvas.width;

//         // Add content
//         const imgData = canvas.toDataURL('image/png');
//         pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, imgHeight);
//       } else {
//         // Process each section individually
//         let yOffset = 15;

//         for (let i = 0; i < reportSections.length; i++) {
//           const section = reportSections[i];

//           if (i > 0 && yOffset > 250) {
//             // Add a new page if running out of space
//             pdf.addPage();
//             yOffset = 15;
//           }

//           // Convert section to canvas
//           const canvas = await html2canvas(section as HTMLElement, {
//             scale: 2,
//             useCORS: true,
//             logging: false,
//             allowTaint: true
//           });

//           // Calculate dimensions to fit on PDF
//           const imgWidth = 190;
//           const imgHeight = canvas.height * imgWidth / canvas.width;

//           // Add section title
//           const sectionTitle = section.getAttribute('data-title');
//           if (sectionTitle) {
//             pdf.setFontSize(14);
//             pdf.setTextColor(30, 64, 175);
//             pdf.text(sectionTitle, 10, yOffset);
//             yOffset += 8;
//           }

//           // Add section content
//           const imgData = canvas.toDataURL('image/png');
//           pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);

//           yOffset += imgHeight + 15;

//           // Add page break if not the last section
//           if (i < reportSections.length - 1 && yOffset > 250) {
//             pdf.addPage();
//             yOffset = 15;
//           }
//         }
//       }

//       // Save the PDF with formatted filename
//       pdf.save(`Immigration_Pathway_Report_${basicInfo.fullName || 'User'}_${new Date().toLocaleDateString('en-CA')}.pdf`);

//       // Show success message
//       setMsg('Report downloaded successfully!');
//       useAuthStore.getState().setIsConsultationDialogOpen(true);
//       setTimeout(() => {
//         useAuthStore.getState().setIsConsultationDialogOpen(false);
//         setMsg('');
//       }, 3000);

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       setMsg('Error downloading report. Please try again later.');
//       useAuthStore.getState().setIsConsultationDialogOpen(true);
//       setTimeout(() => {
//         useAuthStore.getState().setIsConsultationDialogOpen(false);
//         setMsg('');
//       }, 3000);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   async function handleConsultationRequest() {
//     try {
//       const response = await api.get(`/consultancy/${useAuthStore.getState().user?._id}`);

//       if (response.status === 200) {
//         setMsg('You have already requested a consultation. Please wait for our response.');
//       } else if (response.status === 201) {
//         setMsg('Consultation request sent successfully. Please wait for our response.');
//       }

//       // Leave the message visible until user closes it
//     } catch (error) {
//       setMsg('Something went wrong. Please try again later.');
//       console.error(error);

//       setTimeout(() => {
//         useAuthStore.getState().setIsConsultationDialogOpen(false);
//         setMsg('');
//       }, 5000);
//     }
//   }

//   // Helper function to show status icon based on eligibility
//   const StatusIcon = ({ status }) => {
//     if (status === 'Eligible' || status === 'Active' || status === true) {
//       return <CheckCircle className="h-5 w-5 text-green-500" />;
//     } else if (status === 'Temporarily Paused' || status === 'Partially Eligible') {
//       return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
//     } else {
//       return <AlertTriangle className="h-5 w-5 text-red-500" />;
//     }
//   };

//   return (
//     <Layout>
//       {/* Header Section */}
//       <div className={`py-8 bg-white mt-16 border-b border-secondary-200 ${showChatBox ? 'blur' : ''}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="md:flex md:items-center md:justify-between">
//             <div className="flex flex-col w-full">
//               <h1 className="text-2xl font-bold text-secondary-900 sm:text-3xl">
//                 Your Immigration Pathway Report
//               </h1>
//               <p className="mt-2 text-sm text-secondary-500">
//                 Last updated: {new Date().toLocaleDateString('en-CA')}
//               </p>
//             </div>
//             <div className="mt-5 flex flex-col md:flex-row md:mt-0 md:ml-4 space-y-3 md:space-y-0 md:space-x-3 w-full">
//               <Button
//                 variant="outline"
//                 onClick={downloadReport}
//                 leftIcon={isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
//                 className="w-full md:w-auto bg-white text-secondary-950 border border-secondary-950 hover:bg-white hover:text-secondary-950"
//                 disabled={isDownloading || isLoading}
//               >
//                 {isDownloading ? 'Downloading...' : 'Download Report'}
//               </Button>

//               <Button
//                 leftIcon={<Edit className="h-4 w-4" />}
//                 onClick={() => navigate('/profile')}
//                 variant="outline"
//                 className="w-full md:w-auto bg-secondary-950 text-white hover:bg-secondary-950 hover:text-white"
//               >
//                 Update Profile
//               </Button>

//               <Button
//                 leftIcon={isGeneratingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//                 onClick={generateReport}
//                 variant="outline"
//                 className="w-full md:w-auto bg-white text-secondary-950 border border-secondary-950 hover:bg-white hover:text-secondary-950"
//                 disabled={isGeneratingReport}
//               >
//                 {isGeneratingReport ? 'Generating...' : 'Re-Generate Report'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       {isLoading ? (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary-50 h-[70vh] flex items-center justify-center">
//           <LoadingSpinner size='large' message='Loading Report...' />
//         </div>
//       ) : (
//         <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${showChatBox ? 'blur-sm' : ''}`} ref={reportContentRef}>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-8">
//               {/* Express Entry Profile */}
//               <Card className="pdf-section shadow-md" data-title="Express Entry Profile">
//                 <CardHeader className="bg-secondary-100">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-xl">Express Entry Profile</CardTitle>
//                     <div className="bg-primary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                       Primary Recommendation
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-6">
//                   <div className="space-y-6">
//                     {/* CRS Score */}
//                     <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
//                       <div>
//                         <h3 className="text-lg font-semibold text-secondary-900">Comprehensive Ranking System (CRS) Score</h3>
//                         <p className="text-secondary-600 text-sm">Based on your profile information</p>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-3xl font-bold text-secondary-950">{expressEntryProfile?.expressEntryProfile?.crsScore}</div>
//                         <div className="text-xs text-secondary-500">points</div>
//                       </div>
//                     </div>

//                     {/* Score Breakdown */}
//                     <div className="border-t border-secondary-200 pt-4">
//                       <h4 className="font-medium text-secondary-900 mb-3 text-lg">Score Breakdown</h4>
//                       <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//                         {/* Core/Human Capital Factors */}
//                         <div className="flex justify-between items-start flex-wrap gap-2">
//                           <div className="flex-[1_1_0%] min-w-0 pr-2">
//                             <h4 className="text-sm font-medium text-secondary-800">Core/Human Capital Factors:</h4>
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.coreHumanCapital?.reason?.map((bd, idx) => (
//                               <p key={`core-human-capital-${idx}`} className="text-sm text-secondary-600 ml-4 mt-1">• {bd}</p>
//                             ))}
//                           </div>
//                           <span className="text-sm font-medium whitespace-nowrap bg-secondary-50 px-3 py-1 rounded-full">
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.coreHumanCapital?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.coreHumanCapital?.maximum}
//                           </span>
//                         </div>

//                         <hr className="my-3 border-secondary-100" />

//                         {/* Spouse Factors */}
//                         <div className="flex justify-between items-start flex-wrap">
//                           <div className="flex-[1_1_0%] min-w-0 pr-2">
//                             <h4 className="text-sm font-medium text-secondary-800">Spouse Factors:</h4>
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.spouseFactors?.reason?.map((bd, idx) => (
//                               <p key={`spouse-factor-${idx}`} className="text-sm text-secondary-600 ml-4 mt-1">• {bd}</p>
//                             ))}
//                           </div>
//                           <span className="text-sm font-medium whitespace-nowrap bg-secondary-50 px-3 py-1 rounded-full">
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.spouseFactors?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.spouseFactors?.maximum}
//                           </span>
//                         </div>

//                         <hr className="my-3 border-secondary-100" />

//                         {/* Skill Transferability */}
//                         <div className="flex justify-between items-start flex-wrap">
//                           <div className="flex-[1_1_0%] min-w-0 pr-2">
//                             <h4 className="text-sm font-medium text-secondary-800">Skill Transferability:</h4>
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.skillTransferability?.reason?.map((bd, idx) => (
//                               <p key={`skill-transfer-${idx}`} className="text-sm text-secondary-600 ml-4 mt-1">• {bd}</p>
//                             ))}
//                           </div>
//                           <span className="text-sm font-medium whitespace-nowrap bg-secondary-50 px-3 py-1 rounded-full">
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.skillTransferability?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.skillTransferability?.maximum}
//                           </span>
//                         </div>

//                         <hr className="my-3 border-secondary-100" />

//                         {/* Additional Points */}
//                         <div className="flex justify-between items-start flex-wrap">
//                           <div className="flex-[1_1_0%] min-w-0 pr-2">
//                             <h4 className="text-sm font-medium text-secondary-800">Additional Points:</h4>
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown.additionalPoints?.reason?.map((bd, idx) => (
//                               <p key={`additional-point-${idx}`} className="text-sm text-secondary-600 ml-4 mt-1">• {bd}</p>
//                             ))}
//                           </div>
//                           <span className="text-sm font-medium whitespace-nowrap bg-secondary-50 px-3 py-1 rounded-full">
//                             {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.additionalPoints?.score} / {expressEntryProfile?.expressEntryProfile?.scoreBreakdown?.additionalPoints?.maximum}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Eligibility Status */}
//                     <div className="border-t border-secondary-200 pt-4">
//                       <h4 className="font-medium text-secondary-900 mb-4 text-lg">Eligibility Status</h4>
//                       <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//                         {expressEntryProfile?.eligibilityStatus.map((status, index) => (
//                           <div key={`eligibility-status-${index}`} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
//                             <div className="flex-shrink-0">
//                               <StatusIcon status={status.isEligible} />
//                             </div>
//                             <div className="ml-3">
//                               <h5 className="text-sm font-medium text-secondary-900">
//                                 {status.program}
//                               </h5>
//                               {status.reason?.map((reason, idx) => (
//                                 <p key={`status-reason-${index}-${idx}`} className="text-sm text-secondary-600 mt-1">
//                                   {reason}
//                                 </p>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Category-Based Eligibility */}
//                     <div className="border-t border-secondary-200 pt-4">
//                       <h4 className="font-medium text-secondary-900 mb-4 text-lg">Category-Based Eligibility</h4>
//                       <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//                         {expressEntryProfile?.categoryBasedEligibility.map((eligibility, index) => (
//                           <div key={`category-eligibility-${index}`} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
//                             <div className="flex-shrink-0">
//                               <StatusIcon status={eligibility.isEligible} />
//                             </div>
//                             <div className="ml-3">
//                               <h5 className="text-sm font-medium text-secondary-900">
//                                 {eligibility.program}
//                               </h5>
//                               <p className="text-sm text-secondary-600 mt-1">
//                                 {eligibility.reason}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>

//                 <CardFooter className="bg-primary-50">
//                   <div className="w-full flex justify-between items-center">
//                     <a
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       href="https://ircc.canada.ca/english/immigrate/skilled/crs-tool.asp"
//                       className="text-secondary-900 hover:text-secondary-950 text-sm font-medium flex items-center"
//                     >
//                       Learn more about Express Entry
//                       <ExternalLink className="ml-1 h-3 w-3" />
//                     </a>
//                   </div>
//                 </CardFooter>
//               </Card>

//               {/* PNP and Alternative Pathways */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Provincial Nominee Program */}
//                 <Card className='flex flex-col gap-2 justify-between pdf-section shadow-md' data-title="Provincial Nominee Program">
//                   <CardHeader className="bg-secondary-50">
//                     <CardTitle>Provincial Nominee Program</CardTitle>
//                   </CardHeader>

//                   <CardContent>
//                     <div className="space-y-4">
//                       {eligiblePrograms?.length === 0 ? (
//                         <div>
//                           <h4 className="text-sm font-medium text-yellow-500 mb-2">Since you are not eligible for any PNP, here are some suggestions:</h4>
//                           {usePNPStore.getState().report?.suggestions?.slice(0, 3).map((suggestion, index) => (
//                             <div key={`pnp-suggestion-${index}`} className="flex items-start mt-3">
//                               <div className="flex-shrink-0 w-full">
//                                 <h3 className="text-sm font-medium text-secondary-900">{suggestion.action}</h3>
//                                 <p className="text-sm text-secondary-600 mt-1">{suggestion.reason}</p>
//                                 {index !== 2 && <hr className="my-2" />}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         eligiblePrograms?.map((program, index) => (
//                           <div key={`pnp-${index}`} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
//                             <div className="flex-shrink-0">
//                               <StatusIcon status={program.status} />
//                             </div>
//                             <div className="ml-3">
//                               <h3 className="text-sm font-semibold">{program.province}</h3>
//                               <h5 className="text-sm font-medium text-secondary-900 mt-1">
//                                 {program.stream_name}
//                               </h5>
//                               <p className="text-sm text-secondary-600 mt-1">
//                                 {program.reason}
//                               </p>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </CardContent>

//                   <CardFooter className="bg-secondary-50 flex flex-col gap-2">
//                     <Button
//                       onClick={() => setShowPNPOptionsDialog(true)}
//                       variant="outline"
//                       size="sm"
//                       className="w-full"
//                     >
//                       View All PNP Options
//                     </Button>
//                     <Button
//                       onClick={() => setShowSuggestions(true)}
//                       variant="outline"
//                       size="sm"
//                       className="w-full"
//                     >
//                       Show PNP Suggestions
//                     </Button>
//                   </CardFooter>
//                 </Card>

//                 {/* Alternative Pathways */}
//                 <Card className='pdf-section shadow-md' data-title="Alternative Pathways">
//                   <CardHeader className="bg-secondary-50">
//                     <CardTitle>Alternative Pathways</CardTitle>
//                   </CardHeader>

//                   <CardContent>
//                     <div className="space-y-4">
//                       {alternativePrograms.slice(0, 3).map((program, idx) => (
//                         <div
//                           key={`alternative-${idx}`}
//                           className="flex items-start border-b last:border-0 pb-3 last:pb-0"
//                         >
//                           <div className="flex-shrink-0">
//                             <StatusIcon status={program.status} />
//                           </div>
//                           <div className="ml-3">
//                             <h5 className="text-sm font-medium text-secondary-900">
//                               {program.title}
//                             </h5>
//                             <p className={`text-sm ${program.status === 'Active' ? 'text-green-600' :
//                                 program.status === 'Temporarily Paused' ? 'text-yellow-600' :
//                                   'text-red-600'
//                               } font-medium`}>
//                               {program.status}
//                             </p>
//                             <p className="text-sm text-secondary-600 mt-1">
//                               {program.description}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>

//                   <CardFooter className="bg-secondary-50">
//                     <Button
//                       onClick={() => setShowAlternativePathwaysDialog(true)}
//                       variant="outline"
//                       size="sm"
//                       className="w-full"
//                     >
//                       Explore All Alternative Pathways
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </div>

//               {/* Next Steps and Recommendations */}
//               <Card className='pdf-section shadow-md' data-title="Next Steps and Recommendations">
//                 <CardHeader className="bg-secondary-50">
//                   <CardTitle>Next Steps and Recommendations</CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                   <div className="space-y-6">
//                     {/* Improve CRS Score */}
//                     <div>
//                       <h4 className="font-medium text-secondary-900 mb-4 text-lg">Improve Your CRS Score</h4>
//                       <ul className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
//                         {expressEntryRecommendations?.map((recommendation, index) => (
//                           <li
//                             key={`recommendation-${index}`}
//                             className="flex items-start"
//                           >
//                             <div className="flex-shrink-0 h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5">
//                               {index + 1}
//                             </div>
//                             <div>
//                               <p className="font-medium text-secondary-900">{recommendation.question}</p>
//                               <p className="text-secondary-600 mt-1">{recommendation.answer}</p>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Required Documents - Completing this section that was cut off */}
//                     <div className="border-t border-secondary-200 pt-4">
//                       <h4 className="font-medium text-secondary-900 mb-4 text-lg">Required Documents Checklist</h4>
//                       <div className="space-y-4 bg-white p-4
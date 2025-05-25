'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import _ from 'lodash';
import { expressEntryData } from "@/utils/chartsData";
import { cn } from "@/lib/utils";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Text } from "recharts";
import { ExternalLink } from "lucide-react";

export default function ExpressEntryDrawsChart ({ className, isFromHomePage = false }: { className?: string, isFromHomePage?: boolean }) {

    const [isDesktop, setIsDesktop] = useState<boolean>(true);
    const [selectedYear, setSelectedYear] = useState<string>('2025');
    const [selectedProgramType, setSelectedProgramType] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 640); // sm breakpoint
        };
        handleResize(); // initial check
        window.addEventListener('resize', handleResize);

        setSelectedProgramType(isDesktop ? 'All' : 'General');

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setSelectedProgramType(isDesktop ? 'All' : 'Canadian Experience Class');
    }, [isDesktop]);


    const yearsAvailable = _.uniq(
        expressEntryData.map(item => {
            const year = item.Date.split('-')[2];
            return year ? '20' + year : undefined;
        })
    ).filter(Boolean).sort();

    const filteredTypes = expressEntryData.filter(item => {
        const year = '20' + item.Date.split('-')[2];
        return year === selectedYear;
    });

    const programTypes = ['All', ..._.uniq(filteredTypes.map(item => item.Type))];

    // Filter based on year and type
    const filteredData = expressEntryData.filter(item => {
        const year = '20' + item.Date.split('-')[2];
        if (year !== selectedYear) return false;
        if (selectedProgramType !== 'All' && item.Type !== selectedProgramType) return false;
        return true;
    });

    // Sort by date
    const sortedData = _.sortBy(filteredData, item => {
        const [day, monthStr, year] = item.Date.split('-');
        const date = new Date(`${monthStr} ${day}, 20${year}`);
        return date.getTime();
    });

    const normalizedData = sortedData.map(d => ({
        ...d,
        'CRS Cut off': Number(d['CRS Cut off']),
    }));

    // Format date for X-axis labels
    const formatDate = (dateStr: string) => {
        const [day, month] = dateStr.split('-');
        return `${day} ${month}`;
    };


    return (
        <div className={cn("w-[90%] bg-white rounded-lg border-2 border-secondary-300 shadow-lg p-6 mt-16 mx-auto", className)}>
            <div className='flex justify-between items-center'>
                <h2 className="text-2xl font-semibold mb-4">Express Entry Draws</h2>
                {isFromHomePage && <p className="text-sm text-gray-500 flex gap-1 items-center cursor-pointer" onClick={() => router.push('/statistics')}><ExternalLink className='w-4 h-4' /> View All Statistics</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <select
                    className="border-2 border-secondary-300 rounded p-2 w-full sm:w-auto"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}>
                    {yearsAvailable.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select
                    className="border-2 border-secondary-300 rounded p-2 w-full sm:w-auto"
                    value={selectedProgramType}
                    onChange={(e) => setSelectedProgramType(e.target.value)}>
                    {programTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={450}>
                <ComposedChart
                    data={normalizedData}
                    margin={{ top: 40, right: isDesktop ? 40 : 0, left: isDesktop ? 40 : -15, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="Date"
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        label={isDesktop ? {
                            value: "Draw Date",
                            position: "insideBottom",
                            offset: -15,
                            fontSize: 20,
                            fontWeight: "bold",
                        } : undefined}
                    />

                    <YAxis
                        domain={["auto", "auto"]}
                        label={isDesktop ? (
                            < Text
                                x={30}
                                y={170}
                                angle={-90}
                                textAnchor="middle"
                                fontSize={20}
                                fontWeight="bold"
                            >CRS Cut-off</Text>
                        ) : undefined}
                    />
                    <defs>
                        <linearGradient id="colorCRS" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0056a0" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0056a0" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload?.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white border border-gray-300 rounded p-3 shadow text-sm">
                                        <p><strong>Date:</strong> {data.Date}</p>
                                        <p><strong>Number:</strong> {data.Number}</p>
                                        <p><strong>Type:</strong> {data.Type}</p>
                                        <p><strong>CRS Cut-off:</strong> {data["CRS Cut off"]}</p>
                                        <p><strong>Invitations:</strong> {data.Invitations}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="CRS Cut off"
                        stroke="none"
                        fill="url(#colorCRS)"
                    />
                    <Line
                        type="monotone"
                        dataKey="CRS Cut off"
                        name="CRS Cut-off"
                        stroke="#0a3d6f"
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 6 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
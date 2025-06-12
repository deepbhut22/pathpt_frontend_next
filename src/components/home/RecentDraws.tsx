"use client"

import api from "@/utils/axios";
import { useState, useEffect } from "react"

export default function RecentDraws() {
    const [recentDraws, setRecentDraws] = useState<any[]>([]);

    const fetchRecentDraws = async () => {
        try {
            const response = await api.get("/recent-draws");            
            setRecentDraws(response.data);
        } catch (error) {
            console.error("Error fetching recent draws:", error)
        }
    }

    useEffect(() => {
        fetchRecentDraws();
    }, []);

    const formatDate = (date: string) => {

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const utcDate = new Date(date);
        const year = utcDate.getUTCFullYear();
        const month = months[utcDate.getUTCMonth()];
        const day = utcDate.getUTCDate();
        return `${month} ${day}, ${year}`;
    }

    if (recentDraws.length === 0) {
        return (
            <div>
                <p>No recent draws found</p>
            </div>
        )
    }

    return (
        <>
            {recentDraws.map((draw: any, idx: number) => (
            <div
                key={`${draw.drawType}-${idx}`}
                onClick={() => window.open(`${draw.sourceURL}`, "_blank", "noopener,noreferrer")}
                className="border-b border-secondary-200 pb-1 cursor-pointer hover:bg-secondary-200 transition-all duration-300 rounded-md hover:px-2 hover:py-1"
            >
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="font-medium text-secondary-800">{draw.drawType} main type</div>
                        <p className="text-secondary-600">{draw.type}</p>
                    </div>
                    <div className="text-sm text-secondary-500">{formatDate(draw.date)}</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-secondary-600">{draw.invitations} invitations</div>
                        <div className="text-sm font-medium bg-secondary-100 text-secondary-800 px-2 py-1 rounded">CRS: {draw.crsCutOff}</div>
                </div>
            </div>
            ))}
        </>
    )
}

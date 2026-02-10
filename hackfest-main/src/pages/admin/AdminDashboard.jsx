import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import React, { useState, useEffect } from 'react';
import VerticalTimeline from '../../components/timeline/VerticalTimeline';
import { Users, Briefcase, Award, Clock } from 'lucide-react';

export default function AdminDashboard() {
    const { hackathon, activeSlot } = useHackathon();
    const [statsData, setStatsData] = useState({ teams: 0, judges: 0, themes: 0, round: 1 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await hackathonApi.getStats();
                if (res.success) {
                    setStatsData(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { name: 'Total Teams', value: statsData.teams, icon: Users, hoverClass: 'hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]' },
        { name: 'Total Judges', value: statsData.judges, icon: Award, hoverClass: 'hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]' },
        { name: 'Themes', value: statsData.themes, icon: Briefcase, hoverClass: 'hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]' },
        { name: 'Round', value: statsData.round, icon: Clock, hoverClass: 'hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Overview of hackathon status and activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className={`bg-white shadow-sm rounded-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 ${item.hoverClass}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-lg p-3 bg-secondary/10">
                                    <item.icon className="h-6 w-6 text-secondary" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                        <dd>
                                            <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Status */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 h-full">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Event Timeline</h3>
                        </div>
                        <div className="p-6">
                            <VerticalTimeline events={hackathon?.timeline || []} currentRound={hackathon?.currentRound} />
                        </div>
                    </div>
                </div>

                {/* Current Status */}
                <div>
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Current Status</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Current Round</p>
                                    <div className="mt-1 flex items-center">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {hackathon?.currentRound ? `Round ${hackathon.currentRound}` : 'Not Started'}
                                        </span>
                                        {hackathon?.currentRound && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active Teams</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {hackathon?.teams?.length || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Judges Online</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {hackathon?.judges?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

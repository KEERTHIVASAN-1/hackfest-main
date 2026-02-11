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
        { name: 'Total Teams', value: statsData.teams, icon: Users, hoverClass: 'border-secondary/30 hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' },
        { name: 'Total Judges', value: statsData.judges, icon: Award, hoverClass: 'border-secondary/30 hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' },
        { name: 'Themes', value: statsData.themes, icon: Briefcase, hoverClass: 'border-secondary/30 hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' },
        { name: 'Round', value: statsData.round, icon: Clock, hoverClass: 'border-secondary/30 hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' },
    ];

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-secondary/20">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-secondary"></div>
                <h1 className="text-2xl font-bold text-gray-900 relative z-10">
                    Admin Dashboard <span className="text-secondary ml-2">✨</span>
                </h1>
                <p className="text-gray-500 relative z-10">Overview of hackathon status and activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className={`bg-white shadow-lg shadow-secondary/5 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 ${item.hoverClass} relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="p-5 relative z-10">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-lg p-3 bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
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
                    <div className="bg-white shadow-lg shadow-secondary/5 rounded-xl border border-secondary/20 h-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-secondary"></div>
                        <div className="px-6 py-5 border-b border-secondary/10">
                            <h3 className="text-lg font-bold leading-6 text-gray-900">Event Timeline</h3>
                        </div>
                        <div className="p-6">
                            <VerticalTimeline events={hackathon?.timeline || []} currentRound={hackathon?.currentRound} />
                        </div>
                    </div>
                </div>

                {/* Current Status */}
                <div>
                    <div className="bg-white shadow-lg shadow-secondary/5 rounded-xl border border-secondary/20 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-secondary"></div>
                        <div className="px-6 py-5 border-b border-secondary/10 bg-secondary/5">
                            <h3 className="text-lg font-bold leading-6 text-gray-900 flex items-center">
                                <span className="relative flex h-3 w-3 mr-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                                </span>
                                Live Status
                            </h3>
                        </div>
                        <div className="p-6 relative overflow-hidden">
                            {/* Shining background effect */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-xl animate-pulse"></div>
                            
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Activity</p>
                                    <div className="mt-2 flex items-center">
                                        <div className={`p-3 rounded-lg ${activeSlot ? 'bg-secondary text-black shadow-lg shadow-secondary/30 timeline-live-blink' : 'bg-gray-100 text-gray-500'}`}>
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-bold text-gray-900">
                                                {activeSlot ? activeSlot.title : 'No Active Event'}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {activeSlot ? 'In Progress' : 'Waiting for next event'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Round</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-3xl font-extrabold text-gray-900">
                                            {hackathon?.currentRound ? `Round ${hackathon.currentRound}` : '-'}
                                        </span>
                                        {hackathon?.currentRound && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary text-black shadow-sm">
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

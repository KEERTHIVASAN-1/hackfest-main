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
        { name: 'Total Teams', value: statsData.teams, icon: Users, hoverClass: 'hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]' },
        { name: 'Total Judges', value: statsData.judges, icon: Award, hoverClass: 'hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]' },
        { name: 'Themes', value: statsData.themes, icon: Briefcase, hoverClass: 'hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]' },
        { name: 'Round', value: statsData.round, icon: Clock, hoverClass: 'hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-secondary tracking-wide">Admin Dashboard</h1>
                <p className="text-gray-400 mt-1">Overview of {hackathon?.name || 'Hackathon'}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className={`bg-black/40 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-secondary/20 transition-all duration-300 transform hover:-translate-y-1 ${item.hoverClass}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-lg p-3 bg-secondary/10">
                                    <item.icon className="h-6 w-6 text-secondary" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-400 truncate">{item.name}</dt>
                                        <dd>
                                            <div className="text-2xl font-bold text-white mt-1">{item.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Column */}
                <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-secondary/20 p-6 lg:col-span-1">
                    <h2 className="text-lg font-bold text-secondary mb-4 border-b border-gray-800 pb-2">Live Timeline</h2>
                    <VerticalTimeline />
                </div>

                {/* Current Activity / Evaluation Status */}
                <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-secondary/20 p-6 lg:col-span-2">
                    <h2 className="text-lg font-bold text-secondary mb-4 border-b border-gray-800 pb-2">Current Status</h2>
                    <div className="border border-secondary/20 rounded-lg p-6 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all duration-500"></div>
                        
                        {activeSlot ? (
                            <div className="relative z-10">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary text-black mb-3 animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                                    HAPPENING NOW
                                </span>
                                <h3 className="text-2xl font-bold text-white">{activeSlot.activity}</h3>
                                <p className="text-gray-400 mt-2 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-secondary" />
                                    Started at {new Date(activeSlot.from).toLocaleTimeString()}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-400 relative z-10">No active scheduled activity right now.</p>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-md font-bold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-sm font-bold rounded-lg text-black bg-gradient-to-r from-secondary to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 transition-all duration-200 transform hover:scale-[1.02]">
                                Manage Timeline
                            </button>
                            <button className="flex justify-center items-center px-4 py-3 border border-gray-700 shadow-sm text-sm font-bold rounded-lg text-gray-200 bg-gray-800 hover:bg-gray-700 hover:text-white transition-all duration-200 transform hover:scale-[1.02]">
                                View Complaints
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

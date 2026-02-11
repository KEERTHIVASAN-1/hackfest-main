import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import { Play, Square, Lock, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function RoundControl() {
    const { hackathon, loading: ctxLoading } = useHackathon();
    const [loading, setLoading] = useState(false);
    const [localHackathon, setLocalHackathon] = useState(hackathon);

    // Sync local state when hackathon config loads or updates from context
    React.useEffect(() => {
        if (hackathon) setLocalHackathon(hackathon);
    }, [hackathon]);

    const updateRound = async (round, status) => {
        if (!window.confirm(`Are you sure you want to change Round ${round} to ${status}?`)) return;

        setLoading(true);
        try {
            // Logic to update round status
            // In mock, we just update config. In real app, separate endpoint.
            const roundKey = `round${round}`;
            const current = localHackathon.roundStatus || {};
            const newRoundStatus = {
                round1: current.round1 || 'LOCKED',
                round2: current.round2 || 'LOCKED',
                round3: current.round3 || 'LOCKED'
            };
            if (status === 'ACTIVE') {
                ['round1', 'round2', 'round3'].forEach(r => {
                    if (newRoundStatus[r] === 'ACTIVE') newRoundStatus[r] = 'LOCKED';
                });
            }
            newRoundStatus[roundKey] = status;

            const newConfig = {
                ...localHackathon,
                currentRound: parseInt(round, 10),
                roundStatus: newRoundStatus
            };

            await hackathonApi.updateConfig(newConfig);
            setLocalHackathon(newConfig); // Optimistic update or refetch
        } catch (err) {
            alert('Failed to update round');
        } finally {
            setLoading(false);
        }
    };

    if (ctxLoading || !localHackathon) return <LoadingSpinner />;

    const rounds = [1, 2, 3];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>

                <div className="relative">
                    <h1 className="text-2xl font-bold text-gray-900">Round Control</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage the flow of the hackathon rounds.</p>
                </div>
            </div>

            <div className="space-y-6">
                {rounds.map(round => {
                    const status = localHackathon.roundStatus?.[`round${round}`] || 'LOCKED';
                    const isActive = status === 'ACTIVE';
                    const isCompleted = status === 'COMPLETED';

                    return (
                        <div key={round} className={`relative overflow-hidden bg-white shadow-lg shadow-sm rounded-xl p-6 border transition-all duration-300 ${isActive ? 'border-primary border-l-4 ring-1 ring-primary/20' : 'border-gray-200 border-l-4 border-l-gray-300'}`}>
                            {isActive && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 blur-xl"></div>}

                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {round === 3 ? 'Final Round' : `Round ${round}`}
                                    </h3>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${isActive ? 'bg-primary text-black border-primary shadow-primary/30' :
                                                isCompleted ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                                    'bg-white text-gray-500 border-gray-200'
                                            }`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    {status === 'LOCKED' && (
                                        <button
                                            onClick={() => updateRound(round, 'ACTIVE')}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-primary/50 text-sm font-bold rounded-lg shadow-sm text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105"
                                        >
                                            <Play className="mr-2 h-4 w-4" /> Start Round
                                        </button>
                                    )}

                                    {isActive && (
                                        <button
                                            onClick={() => updateRound(round, 'COMPLETED')}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-secondary/20 text-sm font-bold rounded-lg shadow-sm text-secondary bg-secondary/5 hover:bg-secondary/10 focus:outline-none transition-all"
                                        >
                                            <Square className="mr-2 h-4 w-4" /> End Round
                                        </button>
                                    )}

                                    {isCompleted && (
                                        <span className="flex items-center text-gray-400 text-sm font-medium bg-white px-3 py-1 rounded-lg border border-gray-100">
                                            <Lock className="mr-1 h-4 w-4" /> Round Locked
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isActive && (
                                <div className="mt-4 bg-primary/5 border border-gray-200 p-4 rounded-lg flex items-start">
                                    <AlertTriangle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                    <p className="text-sm text-gray-800 font-medium">
                                        Round is currently live. Judges can submit evaluations.
                                        Ending the round will lock evaluations.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}




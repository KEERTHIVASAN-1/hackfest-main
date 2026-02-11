import React, { useEffect, useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { evaluationApi } from '../../api/evaluationApi';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trophy, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ScoresLeaderboard() {
    const { evaluations, refreshData } = useEvaluation();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async () => {
        try {
            const data = await evaluationApi.getLeaderboard();
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Leaderboard fetch failed', err);
            setLeaderboard([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchLeaderboard();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchLeaderboard();
        await refreshData(); // Also refresh context for evaluation count etc.
    };

    if (loading && leaderboard.length === 0) return <LoadingSpinner />;

    const rankedData = (leaderboard || []).map((row, idx) => ({ ...row, rank: idx + 1 }));

    const columns = [
        {
            key: 'rank',
            header: 'Rank',
            render: (row) => (
                <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold border ${row.rank === 1 ? 'bg-primary text-black border-primary shadow-md shadow-primary/50' :
                        row.rank === 2 ? 'bg-gray-200 text-gray-700 border-gray-300' :
                            row.rank === 3 ? 'bg-orange-100 text-orange-800 border-orange-200' : 'text-gray-500 border-transparent'
                    }`}>
                    {row.rank === 1 ? '👑' : row.rank}
                </span>
            )
        },
        { key: 'teamName', header: 'Team Name' },
        { key: 'theme', header: 'Theme' },
        {
            key: 'r1Avg',
            header: 'Round 1 (Avg)',
            render: (row) => (row.r1Avg != null ? <span className="font-mono">{row.r1Avg.toFixed(2)}</span> : '—')
        },
        {
            key: 'r2Avg',
            header: 'Round 2 (Avg)',
            render: (row) => (row.r2Avg != null ? <span className="font-mono">{row.r2Avg.toFixed(2)}</span> : '—')
        },
        {
            key: 'r3Avg',
            header: 'Final (Avg)',
            render: (row) => (row.r3Avg != null ? <span className="font-mono">{row.r3Avg.toFixed(2)}</span> : '—')
        },
        {
            key: 'overallAvg',
            header: 'Overall',
            render: (row) => <span className="font-bold text-lg text-gray-900 font-mono">{(row.overallAvg != null ? row.overallAvg : row.totalScore ?? 0).toFixed(2)}</span>
        }
    ];

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        Scores & Leaderboard <span className="text-primary ml-2"><Trophy className="inline-block w-8 h-8" /></span>
                    </h1>
                    <div className="mt-3 text-sm text-secondary bg-secondary/5 p-3 rounded-lg border border-secondary/20 inline-flex items-center shadow-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        STRICTLY CONFIDENTIAL. Do not show to participants.
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg shadow-sm rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-primary/5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-primary" />
                        Live Ranking
                    </h3>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center px-4 py-2 border border-primary/50 rounded-lg text-sm font-bold text-black bg-white hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
                <Table columns={columns} data={rankedData} keyField="teamId" headerClassName="bg-primary/10 text-gray-900 font-bold" />
            </div>

            <div className="mt-8 bg-white border border-gray-200 shadow-lg shadow-sm rounded-xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Evaluations</span>
                        <div className="text-3xl font-extrabold text-gray-900 mt-1">{evaluations.length}</div>
                    </div>
                    {/* Add more stats if needed */}
                </div>
            </div>
        </div>
    );
}




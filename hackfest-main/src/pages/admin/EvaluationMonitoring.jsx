import React, { useEffect } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useHackathon } from '../../context/HackathonContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Table from '../../components/common/Table';
import { CheckCircle, Clock } from 'lucide-react';

export default function EvaluationMonitoring() {
    const { teamsStatus, evaluations, refreshData, loading } = useEvaluation();
    const { hackathon } = useHackathon();
    const currentRound = hackathon?.currentRound || 1;

    useEffect(() => {
        refreshData();
        // In a real live monitoring, we'd poll here
        const interval = setInterval(refreshData, 10000);
        return () => clearInterval(interval);
    }, [refreshData]);

    if (loading && teamsStatus.length === 0) return <LoadingSpinner />;

    const roundKey = `round${currentRound}`;
    const monitorData = teamsStatus.map(team => {
        const isReady = team.readiness?.[roundKey];
        const teamIdStr = String(team._id);
        const evalCount = (evaluations || []).filter(
            e => String(e.teamId?._id || e.teamId) === teamIdStr && Number(e.round) === Number(currentRound)
        ).length;

        return {
            ...team,
            currentRoundReady: isReady,
            currentRoundEvals: evalCount
        };
    });

    const columns = [
        { key: 'name', header: 'Team Name' },
        {
            key: 'theme',
            header: 'Theme',
            render: (row) => row.themeId?.name || row.theme || '—'
        },
        {
            key: 'status',
            header: 'Readiness',
            render: (row) => (
                row.currentRoundReady
                    ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> READY</span>
                    : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-gray-700 border border-gray-200"><Clock className="w-3 h-3 mr-1" /> Waiting</span>
            )
        },
        {
            key: 'progress',
            header: 'Evaluations',
            render: (row) => (
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{row.currentRoundEvals}</span>
                    <span className="text-gray-500 text-xs ml-1">completed</span>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>

                <div className="relative">
                    <h1 className="text-2xl font-bold text-gray-900">Evaluation Monitor</h1>
                    <p className="mt-1 text-sm text-gray-500">Live tracking of Round {currentRound} progress</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 p-6 shadow-lg shadow-sm rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-2 -mt-2"></div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Teams</div>
                    <div className="mt-2 text-4xl font-bold text-gray-900">{monitorData.length}</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 shadow-lg shadow-sm rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-2 -mt-2"></div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Ready for Eval</div>
                    <div className="mt-2 text-4xl font-bold text-green-600">
                        {monitorData.filter(t => t.currentRoundReady).length}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 p-6 shadow-lg shadow-sm rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-2 -mt-2"></div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Evaluations Done</div>
                    <div className="mt-2 text-4xl font-bold text-primary">
                        {monitorData.reduce((acc, curr) => acc + curr.currentRoundEvals, 0)}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg shadow-sm rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-primary/5">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                        Team Progress
                    </h3>
                </div>
                <Table columns={columns} data={monitorData} keyField="_id" />
            </div>
        </div>
    );
}



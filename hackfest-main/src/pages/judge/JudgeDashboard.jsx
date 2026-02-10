import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHackathon } from '../../context/HackathonContext';
import { useEvaluation } from '../../context/EvaluationContext';
import VerticalTimeline from '../../components/timeline/VerticalTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, Clock } from 'lucide-react';

export default function JudgeDashboard() {
    const { user } = useAuth();
    const { hackathon, loading: hackathonLoading } = useHackathon();
    const { evaluations } = useEvaluation();

    const currentRound = hackathon?.currentRound ?? 1;
    const judgeIdStr = String(user?._id || user?.id || '');
    const myEvaluationsCount = (evaluations || []).filter(
        e => String(e.judgeId?._id || e.judgeId) === judgeIdStr && Number(e.round) === Number(currentRound)
    ).length;

    if (hackathonLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Judge Dashboard</h1>
                <p className="text-gray-500">Welcome, {user?.name ?? 'Judge'}</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 border border-secondary/30 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="text-lg font-bold text-gray-900 relative z-10">Assigned Theme</h3>
                <p className="mt-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400 relative z-10">
                    {typeof user?.assignedTheme === 'object' && user.assignedTheme?.name
                        ? user.assignedTheme.name
                        : (user?.assignedTheme || 'General / Final Round')}
                </p>
                <p className="text-sm text-gray-500 mt-2 relative z-10">
                    You will only see teams from this theme during Round 1 & 2.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 shadow-md rounded-xl flex items-center border border-gray-100 hover:border-secondary/50 transition-colors duration-300 relative overflow-hidden">
                     {/* Glow effect for active round */}
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="p-3 rounded-full bg-secondary/20 text-black mr-4 relative z-10">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm font-medium text-gray-500">Current Round</div>
                        <div className="text-2xl font-bold text-gray-900">Round {currentRound}</div>
                    </div>
                </div>
                <div className="bg-white p-6 shadow rounded-lg flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Evaluated This Round</div>
                        <div className="text-xl font-bold text-gray-900">{myEvaluationsCount} Teams</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Event Timeline</h2>
                    <VerticalTimeline />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Wait for teams to mark themselves as <strong>READY</strong>.</li>
                        <li>You can only evaluate a team <strong>once</strong> per round.</li>
                        <li>Scores range from <strong>0.0 to 10.0</strong>. Decimals are allowed.</li>
                        <li>In Final Round, teams will be auto-assigned to you.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

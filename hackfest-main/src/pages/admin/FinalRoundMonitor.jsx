import React from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { AlertCircle } from 'lucide-react';

export default function FinalRoundMonitor() {
    const { hackathon } = useHackathon();
    const isFinalRound = hackathon?.currentRound === 3;

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>

                <div className="relative">
                    <h1 className="text-2xl font-bold text-gray-900">Final Round Monitor</h1>
                    <p className="mt-1 text-sm text-gray-500">Track final round assignments and progress</p>
                </div>
            </div>

            {!isFinalRound ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-lg shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <AlertCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Final Round is not active yet</h3>
                    <p className="text-gray-500 mt-2">
                        Evaluations are currently in Round {hackathon?.currentRound}.
                        Check back when Final Round starts.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-800 font-medium">
                                    Teams are automatically assigned to judges.
                                    Each judge evaluates 10 teams. Own theme is excluded.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mock Visualization of Assignments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['Judge A', 'Judge B', 'Judge C'].map((judge, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 shadow-lg shadow-sm rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-bl-full -mr-2 -mt-2 group-hover:scale-110 transition-transform"></div>
                                <h3 className="font-bold text-gray-900 mb-4 relative z-10">{judge} - Assignments</h3>
                                <ul className="space-y-2 text-sm text-gray-600 relative z-10">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <li key={n} className="flex justify-between items-center p-2 rounded hover:bg-primary/5 transition-colors">
                                            <span className="font-medium">Team Top {n}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 border border-gray-200">Pending</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}



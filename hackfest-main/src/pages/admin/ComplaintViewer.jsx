import React, { useState, useEffect } from 'react';
import { complaintApi } from '../../api/complaintApi';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

export default function ComplaintViewer() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await complaintApi.getAll();
                setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
        // In real app, poll for new complaints
    }, []);

    const columns = [
        {
            key: 'team',
            header: 'Team',
            render: (row) => <span className="text-gray-900 font-medium">{row.teamId?.name || row.teamId?.leaderName || '—'}</span>
        },
        { key: 'type', header: 'Issue Type', render: (row) => <span className="text-gray-700">{row.type}</span> },
        {
            key: 'description',
            header: 'Description',
            render: (row) => <span className="text-gray-600 block max-w-md">{row.description || '—'}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${row.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-secondary/20 text-black border-secondary/30'}`}>
                    {row.status || 'PENDING'}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Time',
            render: (row) => <span className="text-gray-500">{row.createdAt ? format(new Date(row.createdAt), 'MMM d, h:mm a') : '—'}</span>
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-secondary/20">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-secondary"></div>

                <div className="relative">
                    <h1 className="text-2xl font-bold text-gray-900">Complaint Log</h1>
                    <p className="mt-1 text-sm text-gray-500">Monitor and resolve team complaints</p>
                </div>
            </div>

            {complaints.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-secondary/20 shadow-lg shadow-secondary/5">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                        <AlertCircle className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-gray-900">No complaints</h3>
                    <p className="mt-1 text-sm text-gray-500">Everything seems to be running smoothly!</p>
                </div>
            ) : (
                <div className="bg-white shadow-lg shadow-secondary/5 rounded-xl border border-secondary/20 overflow-hidden">
                    <Table columns={columns} data={complaints} keyField="_id" />
                </div>
            )}
        </div>
    );
}

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
            render: (row) => <span className="text-gray-200">{row.teamId?.name || row.teamId?.leaderName || '—'}</span>
        },
        { key: 'type', header: 'Issue Type', render: (row) => <span className="text-gray-300">{row.type}</span> },
        {
            key: 'description',
            header: 'Description',
            render: (row) => <span className="text-gray-300 block max-w-md">{row.description || '—'}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${row.status === 'RESOLVED' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'}`}>
                    {row.status || 'PENDING'}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Time',
            render: (row) => <span className="text-gray-400">{row.createdAt ? format(new Date(row.createdAt), 'MMM d, h:mm a') : '—'}</span>
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Complaint Log</h1>

            {complaints.length === 0 ? (
                <div className="text-center py-12 bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 shadow-lg">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-200">No complaints</h3>
                    <p className="mt-1 text-sm text-gray-400">Everything seems to be running smoothly!</p>
                </div>
            ) : (
                <Table columns={columns} data={complaints} keyField="_id" />
            )}
        </div>
    );
}

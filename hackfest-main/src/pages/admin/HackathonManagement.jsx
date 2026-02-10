import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Save, Trash2, AlertTriangle } from 'lucide-react';

export default function HackathonManagement() {
    const { hackathon, loading } = useHackathon();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '', // Format for datetime-local input
        endDate: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');

    // Function to format Date to 'YYYY-MM-DDTHH:mm' for input type="datetime-local"
    const formatDateForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        // Adjust for local timezone offset if needed, but simplistic approach here:
        // This simple slice works for ISO strings, but ISO is UTC. 
        // We want local time in the input. 
        // A robust way:
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    useEffect(() => {
        if (hackathon) {
            setFormData({
                name: hackathon.name,
                description: hackathon.description,
                startDate: formatDateForInput(hackathon.startDate),
                endDate: formatDateForInput(hackathon.endDate)
            });
        }
    }, [hackathon]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await hackathonApi.updateConfig({
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            });
            setMessage('Settings saved successfully!');
            // Assuming context might update on refresh or we force reload? 
            // For now, simpler to just show success message.
        } catch (err) {
            setMessage('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('CRITICAL WARNING: Are you sure you want to delete the entire hackathon configuration? This action cannot be undone and may reset all event data.')) {
            return;
        }
        
        setIsDeleting(true);
        try {
            await hackathonApi.deleteConfig();
            setMessage('Hackathon configuration deleted. Refreshing...');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            setMessage('Failed to delete hackathon.');
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-wide">Hackathon Configuration</h1>
                    <p className="mt-2 text-gray-500">Manage the core settings and schedule of the event.</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-xl border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Hackathon Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-3 transition-colors duration-200"
                                placeholder="Enter hackathon name..."
                            />
                            <p className="mt-2 text-sm text-gray-500">Official name of the event.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-3 transition-colors duration-200"
                                placeholder="Brief overview for participants..."
                            />
                            <p className="mt-2 text-sm text-gray-500">Brief overview displayed to participants.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-3 transition-colors duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">End Date & Time</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-3 transition-colors duration-200"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Note: Changing duration affects the valid range for timeline slots.
                            </span>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSaving || isDeleting}
                                    className="inline-flex items-center px-4 py-3 border border-red-300 rounded-lg shadow-sm text-sm font-bold text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {isDeleting ? 'Deleting...' : 'Reset Event'}
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving || isDeleting}
                                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-secondary disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSaving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </div>
                        {message && (
                            <p className={`mt-4 text-sm text-right font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-bold text-blue-800">System Behavior</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                The number of rounds is fixed to 3 (Round 1, Round 2, and Final Round).
                                Once the hackathon starts, changing dates might cause inconsistencies in the timeline.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

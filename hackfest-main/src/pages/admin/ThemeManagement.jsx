import React, { useState, useEffect } from 'react';
import { themeApi } from '../../api/themeApi'; // Need to create this
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash, Briefcase } from 'lucide-react';

export default function ThemeManagement() {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(null);

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const data = await themeApi.getAll();
            setThemes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const themeData = {
            name: formData.get('name'),
            maxTeams: parseInt(formData.get('maxTeams'))
        };

        try {
            if (currentTheme) {
                await themeApi.update(currentTheme.id, themeData);
            } else {
                await themeApi.create(themeData);
            }
            await fetchThemes();
            setModalOpen(false);
        } catch (err) {
            alert('Failed to save theme');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this theme?')) return;
        try {
            await themeApi.delete(id);
            await fetchThemes();
        } catch (err) {
            alert('Failed to delete theme');
        }
    };

    const openModal = (theme = null) => {
        setCurrentTheme(theme);
        setModalOpen(true);
    };

    const columns = [
        { key: 'name', header: 'Theme Name' },
        { key: 'maxTeams', header: 'Max Teams' },
        { key: 'assignedCount', header: 'Assigned Teams', render: (row) => row.assignedCount || 0 }
    ];

    if (loading && themes.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            Theme Management <span className="text-primary ml-2"><Briefcase className="inline-block w-8 h-8" /></span>
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">Create and manage hackathon themes</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center px-4 py-2 border border-primary/50 rounded-lg shadow-sm text-sm font-bold text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-105"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Theme
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-lg shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <Table
                    columns={columns}
                    data={themes}
                    actions={(row) => (
                        <div className="flex space-x-2 justify-end">
                            <button onClick={() => openModal(row)} className="text-gray-600 hover:text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Edit">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(row.id)} className="text-secondary hover:text-secondary hover:bg-secondary/5 p-1 rounded transition-colors" title="Delete">
                                <Trash size={18} />
                            </button>
                        </div>
                    )}
                />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={currentTheme ? 'Edit Theme' : 'Add Theme'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Theme Name</label>
                        <input
                            name="name"
                            required
                            defaultValue={currentTheme?.name}
                            className="mt-1 block w-full bg-white border border-primary/30 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Teams</label>
                        <input
                            type="number"
                            name="maxTeams"
                            required
                            defaultValue={currentTheme?.maxTeams || 10}
                            className="mt-1 block w-full bg-white border border-primary/30 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            Save Theme
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}




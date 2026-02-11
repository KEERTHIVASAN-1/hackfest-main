import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Calendar, Users, Briefcase, Award,
    Shield, LogOut, Menu, X, FileText, Download
} from 'lucide-react';
import clsx from 'clsx';
import AIChatBot from '../components/common/AIChatBot';

const NAVIGATION = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hackathon Setup', href: '/admin/hackathon', icon: Calendar },
    { name: 'Timeline', href: '/admin/timeline', icon: FileText },
    { name: 'Themes', href: '/admin/themes', icon: Briefcase },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Judges', href: '/admin/judges', icon: Shield },
    { name: 'Credentials', href: '/admin/credentials', icon: Download },
    { name: 'Rounds', href: '/admin/rounds', icon: Award },
    { name: 'Monitoring', href: '/admin/monitoring', icon: LayoutDashboard }, // Reusing icon for now
    { name: 'Complaints', href: '/admin/complaints', icon: FileText },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: Award },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Fixed position */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 h-screen shadow-xl shadow-sm",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex h-16 flex-shrink-0 items-center justify-between px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-gray-200">
                    <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-primary text-2xl"><LayoutDashboard className="w-8 h-8" /></span> Admin Panel
                    </span>
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-900"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 custom-scrollbar">
                    <nav className="mt-1 flex-1 space-y-1 px-3">
                        {NAVIGATION.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={clsx(
                                        isActive 
                                            ? 'bg-secondary/10 text-secondary border-secondary shadow-sm' 
                                            : 'text-gray-600 hover:bg-secondary/5 hover:text-gray-900 border-transparent hover:shadow-sm',
                                        'group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-md border-l-4'
                                    )}
                                >
                                    <item.icon
                                        className={clsx(
                                            isActive ? 'text-secondary' : 'text-gray-400 group-hover:text-secondary',
                                            'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex flex-shrink-0 border-t border-gray-200 p-4 bg-primary/5">
                    <button
                        onClick={handleLogout}
                        className="group block w-full flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-primary/20"
                    >
                        <div className="flex items-center">
                            <div>
                                <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-secondary transition-colors duration-200" />
                            </div>
                            <div className="ml-3 text-left">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-secondary transition-colors duration-200">Logout</p>
                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-400 transition-colors duration-200">{user?.name}</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden lg:ml-64 relative">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                
                <div className="lg:hidden pl-2 pt-2 sm:pl-4 sm:pt-4">
                    <button
                        className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md text-gray-600 hover:text-primary border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu size={24} />
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            <AIChatBot />
        </div>
    );
}



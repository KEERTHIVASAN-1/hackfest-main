import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="text-center relative z-10 p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl shadow-sm border border-gray-200">
                <ShieldAlert className="mx-auto h-24 w-24 text-secondary drop-shadow-md" />
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900">Access Denied</h1>
                <p className="mt-2 text-lg text-gray-600">You do not have permission to view this page.</p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-primary hover:bg-white hover:text-primary hover:border-primary transition-all duration-300 shadow-sm"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
}




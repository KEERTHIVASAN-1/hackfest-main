import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, Lock, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import GrootModel from '../components/common/GrootModel';

const ROLES = [
    { id: 'ADMIN', name: 'Administrator' },
    { id: 'JUDGE', name: 'Judge' },
    { id: 'PARTICIPANT', name: 'Participant (Team Leader)' },
];

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(ROLES[0]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(username, password, selectedRole.id);
            if (result.success) {
                if (result.user.isFirstLogin) {
                    navigate('/change-password');
                } else {
                    // Redirect based on role
                    switch (result.user.role) {
                        case 'ADMIN': navigate('/admin/dashboard'); break;
                        case 'JUDGE': navigate('/judge/dashboard'); break;
                        case 'PARTICIPANT': navigate('/participant/dashboard'); break;
                        default: navigate('/');
                    }
                }
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-white relative overflow-hidden">
            {/* Left Side - 3D Model (Desktop Only) */}
            <div className="hidden lg:flex lg:w-[30%] bg-gray-50 flex-col items-center justify-between relative p-8 overflow-hidden border-r border-gray-200 h-full">
                <div className="absolute inset-0 bg-primary/5"></div>
                {/* Background decoration for the left side */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
                
                <div className="w-full flex-grow relative z-10 flex flex-col items-center justify-center">
                   <div className="w-full h-full max-h-[75%]">
                       <GrootModel />
                   </div>
                   <div className="mt-12 text-center">
                       <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">HackFest 2026</h1>
                       <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                           Experience the future of innovation.
                       </p>
                   </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[70%] h-full flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-white overflow-hidden">
                 {/* Mobile background decoration (only visible on small screens) */}
                <div className="absolute lg:hidden top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="w-full max-w-lg sm:max-w-xl relative z-10 flex flex-col items-center">
                    <div className="text-center mb-8 sm:mb-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex flex-col items-center">
                            <span className="text-primary text-4xl sm:text-5xl mb-2"></span>
                            Sign in to your account
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-gray-600">
                            Hackathon Management System
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="bg-white py-8 sm:py-12 px-5 sm:px-6 lg:px-12 shadow-2xl shadow-sm border border-gray-200 sm:rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>
                            
                            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="role" className="block text-sm sm:text-base font-medium text-gray-700">
                                        Select Role
                                    </label>
                                    <div className="mt-2 relative">
                                        <Listbox value={selectedRole} onChange={setSelectedRole}>
                                            <div className="relative mt-1">
                                                <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2.5 sm:py-3 pl-4 pr-10 text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base text-gray-900">
                                                    <span className="block truncate">{selectedRole.name}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" aria-hidden="true" />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={React.Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm sm:text-base shadow-lg shadow-primary/10 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                                                        {ROLES.map((role, roleIdx) => (
                                                            <Listbox.Option
                                                                key={roleIdx}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2.5 sm:py-3 pl-12 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-gray-900'
                                                                    }`
                                                                }
                                                                value={role}
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                            {role.name}
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary">
                                                                                <Check className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm sm:text-base font-medium text-gray-700">
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 placeholder-gray-400 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-2 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 placeholder-gray-400 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary text-sm sm:text-base"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                                            ) : (
                                                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-md bg-secondary/5 border border-secondary/20 p-4 sm:p-5">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm sm:text-base font-medium text-secondary">{error}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-primary py-2.5 sm:py-3 px-5 sm:px-6 text-sm sm:text-base font-bold text-black shadow-md hover:bg-white hover:text-primary hover:border-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Signing in...' : (
                                            <>
                                                <Lock className="mr-2 sm:mr-3 h-5 w-5" /> Sign in
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

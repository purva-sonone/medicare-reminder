import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">

                <div className="flex justify-center">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-5xl animate-bounce">
                        💊
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-blue-600 dark:text-blue-400 tracking-wider">404</h1>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Page Not Found</h2>
                    <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                        The page you are looking for does not exist or has been moved to a new URL path.
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 text-sm transition w-full"
                    >
                        <Home className="w-4 h-4" />
                        Go to Dashboard
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFound;

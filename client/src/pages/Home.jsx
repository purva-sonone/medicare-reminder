import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Pill,
    Clock,
    Calendar,
    Activity,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    LogOut,
    Moon,
    Sun
} from 'lucide-react';

const Home = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();

    const features = [
        {
            title: 'Smart Reminders',
            desc: 'Get real-time browser alerts and notifications so you never miss a dose.',
            icon: Clock,
            color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
        },
        {
            title: 'Dosage Schedule',
            desc: 'Keep track of daily, weekly, or monthly medicine logs sorted by reminder time.',
            icon: Calendar,
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
        },
        {
            title: 'Adherence Tracking',
            desc: 'Visualize your progress in real-time on our interactive dashboard analytics.',
            icon: TrendingUp,
            color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
        },
        {
            title: 'Secure Accounts',
            desc: 'Only you can view and edit your medication records, completely encrypted.',
            icon: ShieldCheck,
            color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center bg-transparent">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl text-white">
                        <Pill className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        MediCare Reminder
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    {user ? (
                        <>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                            <Link
                                to="/dashboard"
                                className="py-2.5 px-5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                            >
                                Go to Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-650/15 text-sm transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
                {/* Text */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-105 dark:border-blue-800 rounded-full text-xs font-semibold">
                        <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                        Empowering Healthy Routines
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                        Never miss a dose.<br />
                        <span className="bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Stay on track.
                        </span>
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto md:mx-0 text-base md:text-lg leading-relaxed">
                        MediCare Reminder is a smart medication reminder platform. Create a schedule, receive real-time alerts, and monitor your adherence rate to ensure optimal health.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3.5 px-7 rounded-xl shadow-xl shadow-emerald-500/20 hover:opacity-90 transition"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition w-full sm:w-auto justify-center"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-300 font-semibold py-3.5 px-7 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition w-full sm:w-auto text-center"
                                >
                                    Live Demo API
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Graphics Hero mockup */}
                <div className="flex-1 w-full max-w-md md:max-w-none flex items-center justify-center">
                    <div className="relative w-full max-w-md p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full blur-2xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10" />

                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-slate-800 dark:text-white">Medication Today</span>
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
                                85% Adherence
                            </span>
                        </div>

                        <div className="py-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-105 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Pill className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-850 dark:text-white text-sm">Paracetamol</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">08:00 AM • 1 Tablet</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 rounded-lg">
                                    Taken
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-800 rounded-2xl shadow-md shadow-blue-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl animate-pulse">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-850 dark:text-white text-sm">Vitamin D3</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">12:30 PM • 1 Capsule</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg">
                                    Upcoming
                                </span>
                            </div>
                        </div>

                        <div className="py-2.5 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-850 dark:text-blue-300 text-xs font-semibold rounded-xl text-center">
                            💡 Turn on browser notifications to get alerts in real-time.
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="bg-white dark:bg-slate-800/50 py-16 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-12">
                        Why MediCare Reminder System?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feat) => {
                            const Icon = feat.icon;
                            return (
                                <div key={feat.title} className="p-6 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-slate-900/50 transition-all duration-300 bg-white dark:bg-slate-800">
                                    <div className={`p-3 rounded-xl inline-block mb-4 ${feat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{feat.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-slate-50 dark:bg-slate-900 text-center text-sm text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
                &copy; {new Date().getFullYear()} MediCare Reminder. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;

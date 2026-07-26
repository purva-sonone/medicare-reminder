import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReminder } from '../context/ReminderContext';
import api from '../utils/api';
import {
    Pill,
    Clock,
    CalendarRange,
    TrendingUp,
    Plus,
    Check,
    X,
    User,
    ChevronRight,
    TrendingDown,
    AlertCircle,
    RotateCcw,
    PackageOpen
} from 'lucide-react';

const Dashboard = () => {
    const { logReminderAction } = useReminder();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/dashboard');
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch dashboard data. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const handleAction = async (medicineId, reminderTime, action) => {
        await logReminderAction(medicineId, reminderTime, action);
        fetchDashboardStats();
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6 max-w-7xl mx-auto w-full animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto w-full">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                    <div>
                        <h4 className="font-bold">Error Loading Dashboard</h4>
                        <p className="text-sm mt-1">{error}</p>
                        <button
                            onClick={fetchDashboardStats}
                            className="mt-3 py-1.5 px-4 bg-red-650 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const {
        todayMedicinesCount = 0,
        nextReminder = null,
        totalMedicines = 0,
        takenTodayCount = 0,
        missedTodayCount = 0,
        skippedTodayCount = 0,
        adherenceRate = 100,
        weeklyAdherenceRate = 100,
        lowStockMedicines = [],
        todaySchedule = [],
    } = stats || {};

    const typeIcons = {
        Tablet: '💊',
        Capsule: '💊',
        Syrup: '🧪',
        Injection: '💉',
        Other: '📦',
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">My Dashboard</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your daily medications</p>
                </div>
                <Link
                    to="/add-medicine"
                    className="flex items-center gap-2 py-2.5 px-5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-blue-500/15 text-sm transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Medicine
                </Link>
            </div>

            {/* Low Stock Warning Banner */}
            {lowStockMedicines.length > 0 && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl flex items-start gap-3">
                    <PackageOpen className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-orange-800 dark:text-orange-300 text-sm">⚠️ Low Stock Alert — Refill Soon!</p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            {lowStockMedicines.map((m) => (
                                <span key={m._id} className="text-xs bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-lg font-semibold">
                                    💊 {m.medicineName} — {m.stock} left
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overview Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Today's Total */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 dark:bg-blue-900/20 rounded-bl-3xl -z-10" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Today's Schedule</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-black text-slate-800 dark:text-white">{todayMedicinesCount}</span>
                        <span className="text-sm text-slate-450 dark:text-slate-400 font-semibold">Reminders</span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Medicines scheduled for today</p>
                </div>

                {/* Card 2: Next Reminder */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden col-span-1 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-50/40 dark:bg-yellow-900/15 rounded-bl-3xl -z-10" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Next Reminder</span>
                    {nextReminder ? (
                        <div className="mt-2 space-y-0.5">
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate flex items-center gap-1">
                                <span className="text-base">{typeIcons[nextReminder.type] || '💊'}</span>
                                {nextReminder.medicineName}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {nextReminder.reminderTime}
                                {nextReminder.overdue && (
                                    <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.2 rounded-md font-bold">
                                        Overdue
                                    </span>
                                )}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
                            {todayMedicinesCount > 0 && takenTodayCount === todayMedicinesCount
                                ? "✨ All completed for today!"
                                : "No upcoming reminders"}
                        </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5 font-medium">Upcoming scheduled intake</p>
                </div>

                {/* Card 3: Adherence Rate */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-50/50 dark:bg-green-900/15 rounded-bl-3xl -z-10" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Adherence Rate</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className={`text-3xl font-black ${adherenceRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {adherenceRate}%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Based on taken vs. missed</p>
                </div>

                {/* Card 4: Intake Progress */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50/50 dark:bg-purple-900/15 rounded-bl-3xl -z-10" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Intake Progress</span>
                    <div className="flex items-baseline gap-2 mt-2 font-bold">
                        <span className="text-3xl font-black text-slate-800 dark:text-white">{takenTodayCount}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-semibold text-sm">/ {todayMedicinesCount} Taken</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                        <div
                            className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${todayMedicinesCount > 0 ? (takenTodayCount / todayMedicinesCount) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                {/* Card 5: Weekly Adherence */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden col-span-1 sm:col-span-2 lg:col-span-4 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/40 dark:bg-blue-900/15 rounded-bl-3xl -z-10" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">📊 Weekly Adherence (Last 7 Days)</span>
                            <div className="flex items-baseline gap-3 mt-2">
                                <span className={`text-4xl font-black ${weeklyAdherenceRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : weeklyAdherenceRate >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {weeklyAdherenceRate}%
                                </span>
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    {weeklyAdherenceRate >= 80 ? '🌟 Excellent! Keep it up!' : weeklyAdherenceRate >= 50 ? '⚡ Good, try to improve' : '❗ Needs attention'}
                                </span>
                            </div>
                        </div>
                        <div className="w-full sm:w-64">
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
                                <span>0%</span><span>50%</span><span>100%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${weeklyAdherenceRate >= 80 ? 'bg-emerald-500' : weeklyAdherenceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${weeklyAdherenceRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Main Grid: Today's Schedule & Adherence Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Col 1 & 2: Today's Schedule Card list */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-6 shadow-sm transition-colors duration-300">
                        <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-700 mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">Today's Schedule</h3>
                                <span className="text-xs text-slate-400 dark:text-slate-500">Medicines ordered by scheduled time</span>
                            </div>
                            <Link
                                to="/schedule"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1"
                            >
                                View Full
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {todaySchedule.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-2xl text-slate-500 mb-4">
                                    💤
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">No Meds Scheduled Today</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                                    You have no medications scheduled or active for today. You can add one anytime!
                                </p>
                                <Link
                                    to="/add-medicine"
                                    className="mt-4 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 transition"
                                >
                                    Schedule Medicine
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todaySchedule.map((med) => (
                                    <div
                                        key={`${med._id}_${med.reminderTime}`}
                                        className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${med.loggedAction === 'Taken'
                                            ? 'bg-emerald-50/20 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800'
                                            : med.loggedAction === 'Skipped'
                                                ? 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 opacity-70'
                                                : med.loggedAction === 'Missed'
                                                    ? 'bg-red-50/25 dark:bg-red-900/10 border-red-105 dark:border-red-800'
                                                    : 'bg-white dark:bg-slate-800/50 border-slate-200/90 dark:border-slate-600 shadow-xs'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl text-xl">
                                                {typeIcons[med.type] || '💊'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                                                    {med.medicineName}
                                                    <span className="text-[10px] py-0.5 px-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-bold">
                                                        {med.dosage}
                                                    </span>
                                                </h4>

                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-450 dark:text-slate-400">
                                                    <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                                                        <Clock className="w-3 h-3" />
                                                        {med.reminderTime}
                                                    </span>
                                                    <span className="capitalize">{med.frequency}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions / Status Badges */}
                                        <div className="flex items-center gap-2 self-end sm:self-auto">
                                            {med.loggedAction ? (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${med.loggedAction === 'Taken'
                                                            ? 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700'
                                                            : med.loggedAction === 'Skipped'
                                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-655 dark:text-slate-300 border-slate-250 dark:border-slate-600'
                                                                : 'bg-red-100/70 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700'
                                                            }`}
                                                    >
                                                        {med.loggedAction === 'Taken' ? '✅ Taken' : med.loggedAction === 'Skipped' ? '⏭ Skipped' : '❌ Missed'}
                                                    </span>
                                                    {/* Undo Button */}
                                                    <button
                                                        onClick={() => handleAction(med._id, med.reminderTime, 'Undo')}
                                                        title="Undo this action"
                                                        className="p-1.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 text-slate-400 dark:text-slate-500 transition"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => handleAction(med._id, med.reminderTime, 'Skipped')}
                                                        className="p-2 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                                                        title="Skip Medicine"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(med._id, med.reminderTime, 'Taken')}
                                                        className="flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/10 transition"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        Take
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Col 3: Side Card (Analytics & Quick Actions) */}
                <div className="space-y-6">
                    {/* Quick Stats list */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-6 shadow-sm transition-colors duration-300">
                        <h3 className="text-base font-black text-slate-800 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
                            Today's Performance
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center sm:text-sm">
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Total Scheduled Items</span>
                                <span className="font-bold text-slate-800 dark:text-white">{todayMedicinesCount}</span>
                            </div>
                            <div className="flex justify-between items-center sm:text-sm">
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Taken Doses</span>
                                <span className="font-bold text-emerald-650 dark:text-emerald-400">{takenTodayCount} / {todayMedicinesCount}</span>
                            </div>
                            <div className="flex justify-between items-center sm:text-sm">
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Missed Doses</span>
                                <span className="font-bold text-red-650 dark:text-red-400">{missedTodayCount}</span>
                            </div>
                            <div className="flex justify-between items-center sm:text-sm">
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Skipped Doses</span>
                                <span className="font-bold text-slate-500 dark:text-slate-400">{skippedTodayCount}</span>
                            </div>
                            <div className="flex justify-between items-center sm:text-sm pt-4 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-slate-450 dark:text-slate-400 font-bold text-sm">Adherence Ratio</span>
                                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">{adherenceRate}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions List */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-6 shadow-sm transition-colors duration-300">
                        <h3 className="text-base font-black text-slate-800 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
                            Quick Navigation
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/schedule"
                                className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl font-bold text-center text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-800 transition-all duration-200"
                            >
                                📅 Schedule
                            </Link>
                            <Link
                                to="/history"
                                className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl font-bold text-center text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-100 dark:hover:border-emerald-800 transition-all duration-200"
                            >
                                📜 Logs History
                            </Link>
                            <Link
                                to="/profile"
                                className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl font-bold text-center text-xs text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-650 dark:hover:text-purple-400 hover:border-purple-100 dark:hover:border-purple-800 transition-all duration-200"
                            >
                                👤 Profile
                            </Link>
                            <Link
                                to="/add-medicine"
                                className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl font-bold text-center text-xs text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-100 dark:hover:border-orange-800 transition-all duration-200"
                            >
                                ➕ Add Med
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;

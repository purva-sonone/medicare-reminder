import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReminder } from '../context/ReminderContext';
import api from '../utils/api';
import { Clock, Check, X, Edit, Pill, Plus, Calendar, AlertCircle } from 'lucide-react';

const TodaySchedule = () => {
    const { todaySchedule, logReminderAction, loadingSchedule, fetchTodaySchedule } = useReminder();

    const [activeTab, setActiveTab] = useState('today');
    const [allMedicines, setAllMedicines] = useState([]);
    const [allLoading, setAllLoading] = useState(false);
    const [allError, setAllError] = useState('');

    const fetchAllMedicines = async () => {
        try {
            setAllLoading(true);
            setAllError('');
            const { data } = await api.get('/medicines');
            setAllMedicines(data);
            setAllLoading(false);
        } catch (err) {
            console.error(err);
            setAllError('Failed to load all registered medications.');
            setAllLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'all') {
            fetchAllMedicines();
        } else {
            fetchTodaySchedule();
        }
    }, [activeTab]);

    const typeIcons = {
        Tablet: '💊',
        Capsule: '💊',
        Syrup: '🧪',
        Injection: '💉',
        Other: '📦',
    };

    return (
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">

            {/* Title Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">Medication Schedule</h2>
                    <p className="text-xs text-slate-450 dark:text-slate-400">View today's due alerts or manage your full library</p>
                </div>
                <Link
                    to="/add-medicine"
                    className="flex items-center gap-2 py-2.5 px-5 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Medication
                </Link>
            </div>

            {/* Tabs Layout */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('today')}
                    className={`pb-3 px-6 text-sm font-bold border-b-2 transition ${activeTab === 'today'
                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    Today's Schedule
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-6 text-sm font-bold border-b-2 transition ${activeTab === 'all'
                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    All Registered Medications ({allMedicines.length || '...'})
                </button>
            </div>

            {/* TAB CONTENT: TODAY SCHEDULE */}
            {activeTab === 'today' && (
                <div className="space-y-4">
                    {loadingSchedule ? (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                            ))}
                        </div>
                    ) : todaySchedule.length === 0 ? (
                        <div className="py-16 text-center bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-8 transition-colors duration-300">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                ☀️
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">You are All Clear for Today!</h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-1">
                                You have no scheduled doses running today. Make sure you set the start/end dates correctly when adding.
                            </p>
                            <Link
                                to="/add-medicine"
                                className="mt-6 inline-flex items-center gap-2 py-2 px-5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition"
                            >
                                Create New Reminder
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {todaySchedule.map((med) => (
                                <div
                                    key={`${med._id}_${med.reminderTime}`}
                                    className={`p-5 border rounded-2xl flex items-center justify-between gap-4 transition bg-white dark:bg-slate-800 border-slate-205 dark:border-slate-700 shadow-sm`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl text-2xl">
                                            {typeIcons[med.type] || '💊'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{med.medicineName}</h4>
                                                <span className="text-[10px] font-bold text-blue-605 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                                    {med.dosage}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-450 dark:text-slate-400 font-semibold">
                                                <span className="flex items-center gap-1 text-slate-650 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                                    <Clock className="w-3 h-3 text-blue-500" />
                                                    {med.reminderTime}
                                                </span>
                                                <span className="capitalize">{med.frequency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {med.loggedAction ? (
                                            <span
                                                className={`text-xs font-black px-3 py-1.5 rounded-xl border ${med.loggedAction === 'Taken'
                                                    ? 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-250 dark:border-emerald-700'
                                                    : med.loggedAction === 'Skipped'
                                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-655 dark:text-slate-300 border-slate-250 dark:border-slate-600'
                                                        : 'bg-red-100/70 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-255 dark:border-red-700'
                                                    }`}
                                            >
                                                {med.loggedAction}
                                            </span>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => logReminderAction(med._id, med.reminderTime, 'Skipped')}
                                                    className="p-2 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                                                    title="Skip Reminder"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => logReminderAction(med._id, med.reminderTime, 'Taken')}
                                                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                                                    title="Mark as Taken"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: ALL MEDICATIONS */}
            {activeTab === 'all' && (
                <div className="space-y-4">
                    {allError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-750 dark:text-red-400 text-sm flex items-start gap-2.5">
                            <AlertCircle className="w-5 h-5 text-red-505 flex-shrink-0 mt-0.5" />
                            <span>{allError}</span>
                        </div>
                    )}

                    {allLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                            ))}
                        </div>
                    ) : allMedicines.length === 0 ? (
                        <div className="py-16 text-center bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-8 transition-colors duration-300">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                💊
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">No Medications In Your Profile</h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-1">
                                You have not registered any medications. Schedule your first one mapping start and end times.
                            </p>
                            <Link
                                to="/add-medicine"
                                className="mt-6 inline-flex items-center gap-2 py-2 px-5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allMedicines.map((med) => (
                                <div
                                    key={med._id}
                                    className="p-5 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-4 shadow-sm transition-colors duration-300"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl text-2xl">
                                            {typeIcons[med.type] || '💊'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-slate-850 dark:text-white text-sm">{med.medicineName}</h4>
                                                <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                                                    {med.dosage}
                                                </span>
                                                <span
                                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${med.status === 'Active'
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                                                        : med.status === 'Completed'
                                                            ? 'bg-blue-105 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                                        }`}
                                                >
                                                    {med.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-450 dark:text-slate-400 font-semibold">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                    {med.reminderTime}
                                                </span>
                                                <span className="capitalize">{med.frequency}</span>
                                                <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(med.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(med.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/edit-medicine/${med._id}`}
                                        className="p-2.5 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-505 dark:text-slate-400 transition"
                                        title="Edit/Delete"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default TodaySchedule;

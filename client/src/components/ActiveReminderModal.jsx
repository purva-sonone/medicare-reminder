import React from 'react';
import { useReminder } from '../context/ReminderContext';
import { Pill, Check, X, Bell, Clock } from 'lucide-react';

const ActiveReminderModal = () => {
    const { activeAlert, logReminderAction, setActiveAlert, stopAlarm, snoozeAlert } = useReminder();

    const handleAction = (action) => {
        stopAlarm();
        logReminderAction(activeAlert._id, activeAlert.reminderTime, action);
    };

    const handleClose = () => {
        stopAlarm();
        setActiveAlert(null);
    };

    const handleSnooze = () => {
        snoozeAlert(activeAlert);
    };

    if (!activeAlert) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-700 overflow-hidden transform scale-100 transition-all duration-300">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 text-white flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md animate-pulse">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">Medication Alert</span>
                        <h3 className="text-xl font-bold">Reminder Time</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Pill className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white">{activeAlert.medicineName}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Dosage: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeAlert.dosage}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Type: {activeAlert.type}</p>
                        </div>
                    </div>

                    {activeAlert.notes && (
                        <div className="p-3.5 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-lg text-sm">
                            <span className="font-semibold text-xs uppercase block tracking-wider mb-0.5">Notes:</span>
                            {activeAlert.notes}
                        </div>
                    )}

                    <p className="text-center text-sm font-medium text-slate-650 dark:text-slate-300">
                        Please take your medicine now. Did you take it?
                    </p>

                    {/* Snooze row */}
                    <button
                        onClick={handleSnooze}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-semibold text-sm transition-colors"
                    >
                        <Clock className="w-4 h-4" />
                        Snooze — Remind me in 5 minutes
                    </button>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleAction('Skipped')}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Skip
                        </button>
                        <button
                            onClick={() => handleAction('Taken')}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Check className="w-4 h-4" />
                            Mark as Taken
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveReminderModal;

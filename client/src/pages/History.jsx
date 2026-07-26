import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Loader2, AlertCircle, Calendar, Clock, Filter, Trash } from 'lucide-react';

const History = () => {
    const [historyLogs, setHistoryLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [range, setRange] = useState('all');

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {};
            if (search.trim() !== '') params.search = search.trim();
            if (status !== 'all') params.status = status;
            if (range !== 'all') params.range = range;

            const { data } = await api.get('/history', { params });
            setHistoryLogs(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch history logs. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchHistory();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, status, range]);

    const typeIcons = {
        Tablet: '💊',
        Capsule: '💊',
        Syrup: '🧪',
        Injection: '💉',
        Other: '📦',
    };

    return (
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white font-sans">Medicine History Logs</h2>
                <p className="text-xs text-slate-450 dark:text-slate-400">Review previous intakes, skips, and missed alerts</p>
            </div>

            {/* Filter Options Bar */}
            <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-5 shadow-sm space-y-4 transition-colors duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Search Term */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search medicine name..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs transition"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                            <Filter className="w-4 h-4" />
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-805 dark:text-white text-xs transition"
                        >
                            <option value="all">All Actions</option>
                            <option value="Taken">Taken</option>
                            <option value="Missed">Missed</option>
                            <option value="Skipped">Skipped</option>
                        </select>
                    </div>

                    {/* Range Selection */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-405 dark:text-slate-500">
                            <Calendar className="w-4 h-4" />
                        </span>
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-550 text-slate-805 dark:text-white text-xs transition"
                        >
                            <option value="all">All Records</option>
                            <option value="daily">Daily History</option>
                            <option value="weekly">Weekly History</option>
                            <option value="monthly">Monthly History</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Main logs display list */}
            <div className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-750 dark:text-red-400 text-sm flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-red-505 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-slate-205 dark:bg-slate-700 rounded-2xl"></div>
                        ))}
                    </div>
                ) : historyLogs.length === 0 ? (
                    <div className="py-16 text-center bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-8 transition-colors duration-300">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            📓
                        </div>
                        <h4 className="font-bold text-slate-850 dark:text-white text-sm">No Logs Found</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-1">
                            Could not find any history matches. Try adjusting your search keyword or selected filter queries.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/75 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                                        <th className="py-4 px-6">Medicine Details</th>
                                        <th className="py-4 px-6 text-center">Log Date</th>
                                        <th className="py-4 px-6 text-center">Target Time</th>
                                        <th className="py-4 px-6 text-center">Action Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {historyLogs.map((log) => {
                                        const med = log.medicineId || {};
                                        return (
                                            <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition">
                                                {/* Name & Dosage */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">
                                                            {typeIcons[med.type] || '💊'}
                                                        </span>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                                                                {med.medicineName || 'Deleted Medication'}
                                                            </h4>
                                                            <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold">{med.dosage || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Calendar log date */}
                                                <td className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-slate-100 dark:bg-slate-700 text-slate-655 dark:text-slate-300 rounded-lg">
                                                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                        {new Date(log.date).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </td>

                                                {/* Target Alarm Time */}
                                                <td className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-slate-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 border border-blue-105 dark:border-blue-800 rounded-lg">
                                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                        {log.reminderTime}
                                                    </span>
                                                </td>

                                                {/* Log Button */}
                                                <td className="py-4 px-6 text-center">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-bold py-1 px-3 rounded-full border ${log.action === 'Taken'
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700'
                                                            : log.action === 'Skipped'
                                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-205 dark:border-slate-600'
                                                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700'
                                                            }`}
                                                    >
                                                        {log.action}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default History;

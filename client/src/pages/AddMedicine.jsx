import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Pill, ArrowLeft, Loader2, AlertCircle, Calendar, ClipboardList } from 'lucide-react';

const AddMedicine = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        medicineName: '',
        dosage: '',
        type: 'Tablet',
        frequency: 'Daily',
        reminderTime: '08:00',
        startDate: new Date().toISOString().split('T')[0], // Defaults to today
        endDate: '',
        notes: '',
        stock: '30',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { medicineName, dosage, type, frequency, reminderTime, startDate, endDate } = formData;

        if (!medicineName || !dosage || !type || !frequency || !reminderTime || !startDate || !endDate) {
            setError('Please fill in all required fields');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be after end date');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await api.post('/medicines', formData);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to add medicine. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/dashboard"
                    className="p-2 border border-slate-205 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-550 dark:text-slate-400 transition shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">Add Medicine</h2>
                    <p className="text-xs text-slate-450 dark:text-slate-400">Schedule a new medication reminder</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-505 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors duration-300">

                {/* Core fields (Name and Dosage) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Medicine Name *
                        </label>
                        <input
                            type="text"
                            name="medicineName"
                            value={formData.medicineName}
                            onChange={handleChange}
                            placeholder="e.g. Paracetamol"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Dosage *
                        </label>
                        <input
                            type="text"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            placeholder="e.g. 1 Tablet, 10ml, 2 drops"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                            required
                        />
                    </div>
                </div>

                {/* Dropdowns (Type and Frequency) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Medicine Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white text-sm transition"
                        >
                            <option value="Tablet">Tablet</option>
                            <option value="Capsule">Capsule</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Frequency *
                        </label>
                        <select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white text-sm transition"
                        >
                            <option value="Daily">Daily</option>
                            <option value="Twice Daily">Twice Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                {/* Timing and Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Reminder Time *
                        </label>
                        <input
                            type="time"
                            name="reminderTime"
                            value={formData.reminderTime}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white text-sm transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-2">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white text-sm transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-2">
                            End Date *
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white text-sm transition"
                            required
                        />
                    </div>
                </div>

                {/* Stock tracker field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Current Stock Quantity (Optional)
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="e.g. 30"
                            min="0"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                        />
                    </div>
                </div>

                {/* Notes Textarea */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Notes / Instructions (Optional)
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="e.g. Take after breakfast. Keep refrigerated."
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-550 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition resize-none"
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <Link
                        to="/dashboard"
                        className="py-3 px-6 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-550 dark:text-slate-400 font-bold transition text-sm"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 py-3 px-6 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 disabled:bg-blue-400 transition text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Schedule...
                            </>
                        ) : (
                            <>
                                Save Medicine
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddMedicine;

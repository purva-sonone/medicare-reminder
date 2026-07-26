import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle, AlertCircle, Loader2, Bell, Play, Check, Volume2, Eye, EyeOff } from 'lucide-react';
import { RINGTONES, getSavedRingtoneId, saveRingtoneId, previewRingtone, getSavedVolume, saveVolume } from '../utils/alarmHelper';

const Profile = () => {
    const { user, updateProfile } = useAuth();

    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Ringtone settings
    const [selectedRingtone, setSelectedRingtone] = useState(getSavedRingtoneId());
    const [ringtoneSaved, setRingtoneSaved] = useState(false);
    const [volume, setVolume] = useState(getSavedVolume());
    const [volumeSaved, setVolumeSaved] = useState(false);

    const handleRingtoneSave = () => {
        saveRingtoneId(selectedRingtone);
        saveVolume(volume);
        setRingtoneSaved(true);
        setTimeout(() => setRingtoneSaved(false), 2000);
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = profileData;

        if (!fullName || !email) {
            setError('Full Name and Email fields are required');
            return;
        }

        if (password) {
            if (password.length < 8) {
                setError('New Password must be at least 8 characters long');
                return;
            }
            if (password !== confirmPassword) {
                setError('New Passwords do not match');
                return;
            }
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const payload = { fullName, email };
            if (password) {
                payload.password = password;
                payload.confirmPassword = confirmPassword;
            }

            await updateProfile(payload);

            setSuccess('Profile updated successfully!');

            setProfileData((prev) => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));
            setSaving(false);
        } catch (err) {
            setSaving(false);
            setError(err.message || 'Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto w-full space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">My Profile</h2>
                <p className="text-xs text-slate-450 dark:text-slate-400">Review personal options or change your password</p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-colors duration-300">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center font-black text-4xl shadow-md">
                    {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-805 dark:text-white">{user?.fullName}</h3>
                    <p className="text-sm text-slate-450 dark:text-slate-400">{user?.email}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 py-1 px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-105 dark:border-blue-800">
                        🔑 Logged In Securely
                    </div>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-750 dark:text-red-400 text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-505 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-400 text-sm flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-505 flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                </div>
            )}

            {/* Profile Updates forms */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors duration-300">
                <h3 className="text-base font-black text-slate-800 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-700">
                    Edit Profile Details
                </h3>

                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                                <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            </span>
                            <input
                                type="text"
                                name="fullName"
                                value={profileData.fullName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-805 dark:text-white text-sm transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-805 dark:text-white text-sm transition"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Change password */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-6">
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Security & Password</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Fill this out only if you wish to change your current password</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={profileData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={profileData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat new password"
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit btn */}
                <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 disabled:bg-blue-400 transition text-sm"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating Profile...
                            </>
                        ) : (
                            <>
                                Save Updates
                            </>
                        )}
                    </button>
                </div>

            </form>

            {/* ===================== ALARM RINGTONE SETTINGS ===================== */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <Bell className="w-4 h-4 text-blue-500" />
                            Alarm Ringtone Settings
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Choose which sound plays when your medicine reminder fires
                        </p>
                    </div>
                    <button
                        onClick={handleRingtoneSave}
                        className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${ringtoneSaved
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                            }`}
                    >
                        {ringtoneSaved ? (
                            <><Check className="w-4 h-4" /> Saved!</>
                        ) : (
                            'Save Ringtone'
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {RINGTONES.map((ringtone) => {
                        const isSelected = selectedRingtone === ringtone.id;
                        return (
                            <div
                                key={ringtone.id}
                                onClick={() => setSelectedRingtone(ringtone.id)}
                                className={`relative flex items-center gap-3.5 p-4.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${isSelected
                                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-900/20 shadow-md shadow-blue-500/10'
                                    : 'border-slate-150 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-900/10'
                                    }`}
                            >
                                {/* Emoji */}
                                <div className={`text-2xl w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${isSelected ? 'bg-blue-105 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                    }`}>
                                    {ringtone.emoji}
                                </div>

                                {/* Info - Name & Rating */}
                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <p className={`font-black text-sm leading-tight ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                                            {ringtone.name}
                                        </p>
                                        {ringtone.recommended && (
                                            <span className="text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-1.5 py-0.5 rounded-md shadow-sm flex-shrink-0">
                                                Rec
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-amber-500 text-xs mt-0.5 font-sans tracking-tight">
                                        {ringtone.rating || '⭐⭐⭐⭐☆'}
                                    </div>
                                </div>

                                {/* Selected check */}
                                {isSelected && (
                                    <div className="absolute bottom-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}

                                {/* Preview Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        previewRingtone(ringtone.id);
                                    }}
                                    title="Preview Sound"
                                    className={`absolute top-2.5 right-2.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${isSelected
                                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 opacity-100'
                                        : 'bg-slate-200 dark:bg-slate-600 text-slate-650 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                                        }`}
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Volume Slider */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-blue-500" />
                            Alarm Volume
                        </label>
                        <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-600 accent-blue-600"
                    />
                    <div className="flex justify-between text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setVolume(0)}
                            className={`px-2 py-1 rounded-lg transition ${volume === 0 ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            🔇 Silent
                        </button>
                        <button
                            type="button"
                            onClick={() => setVolume(1)}
                            className={`px-2 py-1 rounded-lg transition ${volume === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'}`}
                        >
                            🔔 Max
                        </button>
                    </div>
                </div>

                {/* Tip */}
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2 border-t border-slate-100 dark:border-slate-700">
                    💡 Click any card to select • hover &amp; click <Play className="w-3 h-3 inline" /> to preview • then hit <strong>Save Ringtone</strong>
                </p>
            </div>

        </div>
    );
};

export default Profile;

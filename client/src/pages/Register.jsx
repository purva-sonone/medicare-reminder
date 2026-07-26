import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pill, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const { register, user, loading, error, setError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [uiError, setUiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
        setError(null);
    }, [user, navigate, setError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setUiError('');
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = formData;

        if (!fullName || !email || !password || !confirmPassword) {
            setUiError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setUiError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setUiError('Password must be at least 8 characters');
            return;
        }

        try {
            await register(fullName, email, password, confirmPassword);
            navigate('/dashboard');
        } catch (err) {
            // Error handled by AuthContext
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-2xl -z-10" />

                {/* LOGO */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl text-white">
                            <Pill className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            MediCare
                        </span>
                    </Link>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Create Account</h2>
                    <p className="text-slate-455 dark:text-slate-400 text-sm mt-1">Get scheduled reminders in seconds</p>
                </div>

                {/* MESSAGES */}
                {(uiError || error) && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-705 dark:text-red-400 text-sm flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{uiError || error}</span>
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                <UserIcon className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Purva Malviya"
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-405 dark:text-slate-500">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="purva@example.com"
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-405 dark:text-slate-500">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                className="w-full pl-11 pr-12 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-405 dark:text-slate-500">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat password"
                                className="w-full pl-11 pr-12 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-205 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl shadow-lg shadow-blue-505/20 disabled:bg-blue-400 transition text-sm mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pill, Mail, Lock, ArrowRight, AlertCircle, Loader2, UserCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login, user, loading, error, setError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [uiError, setUiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        const { email, password } = formData;

        if (!email || !password) {
            setUiError('Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            // Error handled by AuthContext
        }
    };

    const handleDemoLogin = async (e) => {
        e.preventDefault();
        setUiError(''); // clear any pre-existing errors

        try {
            // First we try to directly log them in with the demo credentials
            await login('demo@medicare.com', 'password123');
            navigate('/dashboard');
        } catch (err) {
            // If the account doesn't exist yet in the database, we let them know!
            setUiError("Demo account not found! You need to click 'Register for free' below and create an account with email 'demo@medicare.com' and password 'password123' first.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-2xl -z-10" />

                {/* LOGO */}
                <div className="flex flex-col items-center mb-6">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl text-white">
                            <Pill className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            MediCare
                        </span>
                    </Link>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">Sign in to manage your medication schedules</p>
                </div>

                {/* MESSAGES */}
                {(uiError || error) && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{uiError || error}</span>
                    </div>
                )}

                {/* FORM - autoComplete off applied to prevent browser filling random emails */}
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                autoComplete="new-password"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition"
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

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:bg-blue-400 transition"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Demo Button Helper */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={handleDemoLogin}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition text-sm"
                    >
                        <UserCircle className="w-5 h-5" />
                        Use Demo Dummy Account
                    </button>
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        Register for free
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    PlusCircle,
    CalendarDays,
    History as HistoryIcon,
    User as UserIcon,
    LogOut,
    Pill,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!user) return null;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: "Today's Schedule", path: '/schedule', icon: CalendarDays },
        { name: 'Add Medicine', path: '/add-medicine', icon: PlusCircle },
        { name: 'History Logs', path: '/history', icon: HistoryIcon },
        { name: 'My Profile', path: '/profile', icon: UserIcon },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0 transition-colors duration-300">
                {/* Brand / Logo */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <Link to="/dashboard" className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl text-white shadow-md shadow-blue-500/25">
                            <Pill className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent leading-none">
                                MediCare
                            </h1>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                                Reminder
                            </span>
                        </div>
                    </Link>
                </div>

                {/* User Card */}
                <div className="p-4 mx-4 my-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                            {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">{user.fullName}</h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Dark Mode Toggle + Logout */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-3.5 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-semibold transition-all duration-150"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3.5 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition-all duration-150"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-300">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg text-white">
                        <Pill className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        MediCare
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleDarkMode}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/45 z-40 backdrop-blur-xs"
                />
            )}

            {/* Mobile Sidebar Cabinet */}
            <aside
                className={`md:hidden fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-slate-800 shadow-2xl border-r border-slate-250 dark:border-slate-700 z-50 transform transition-transform duration-250 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg text-white">
                            <Pill className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            MediCare
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 mx-4 my-4 rounded-xl border border-slate-100 dark:border-slate-600">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">{user.fullName}</h4>
                    <p className="text-xs text-slate-505 dark:text-slate-400 truncate">{user.email}</p>
                </div>

                <nav className="px-4 space-y-1.5">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => {
                            setMobileOpen(false);
                            logout();
                        }}
                        className="flex items-center gap-3.5 w-full px-4 py-3 text-red-650 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition-all duration-150"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;

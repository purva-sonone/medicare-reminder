import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReminderProvider } from './context/ReminderContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddMedicine from './pages/AddMedicine';
import EditMedicine from './pages/EditMedicine';
import TodaySchedule from './pages/TodaySchedule';
import History from './pages/History';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout & Overlays
import Navbar from './components/Navbar';
import ActiveReminderModal from './components/ActiveReminderModal';

// Protected Route Shield
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Checking credentials...</span>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Application Main Layout
const AppLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      {/* Dynamic reminder alerting overlay */}
      <ActiveReminderModal />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ReminderProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/schedule" element={<TodaySchedule />} />
                  <Route path="/add-medicine" element={<AddMedicine />} />
                  <Route path="/edit-medicine/:id" element={<EditMedicine />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* 404 Pages */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </ReminderProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

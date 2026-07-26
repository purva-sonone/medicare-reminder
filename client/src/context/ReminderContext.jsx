import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { requestNotificationPermission, showBrowserNotification } from '../utils/notificationHelper';
import { startAlarm as alarmStart, stopAlarm as alarmStop } from '../utils/alarmHelper';

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
    const { user } = useAuth();
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [activeAlert, setRawActiveAlert] = useState(null);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const intervalRef = useRef(null);
    const scheduleRef = useRef([]);

    // Keep scheduleRef updated
    useEffect(() => {
        scheduleRef.current = todaySchedule;
    }, [todaySchedule]);

    const startAlarm = useCallback(() => { try { alarmStart(); } catch (e) { } }, []);
    const stopAlarm = useCallback(() => { try { alarmStop(); } catch (e) { } }, []);

    // Wrapped setActiveAlert: stop alarm when alert is cleared
    const setActiveAlert = useCallback((val) => {
        if (!val) stopAlarm();
        setRawActiveAlert(val);
    }, [stopAlarm]);

    // Snooze: stop alarm+modal, re-trigger after 5 minutes
    const snoozeAlert = useCallback((med) => {
        stopAlarm();
        setRawActiveAlert(null);
        setTimeout(() => {
            setRawActiveAlert(med);
            try { alarmStart(); } catch (e) { }
        }, 5 * 60 * 1000); // 5 minutes
    }, [stopAlarm]);

    // Fetch today's schedule
    const fetchTodaySchedule = async () => {
        if (!user) return;
        try {
            setLoadingSchedule(true);
            const { data } = await api.get('/dashboard'); // Fetching dashboard contains full today schedule + statuses
            setTodaySchedule(data.todaySchedule || []);
            setLoadingSchedule(false);
        } catch (err) {
            console.error('Error fetching today schedule:', err);
            setLoadingSchedule(false);
        }
    };

    // Log action (Taken, Skipped, Missed, or Undo)
    const logReminderAction = async (medicineId, reminderTime, action) => {
        try {
            const todayStr = new Date().toISOString();
            await api.post('/history', {
                medicineId,
                date: todayStr,
                reminderTime,
                action,
            });

            // If Undo — also clear the sessionStorage key so reminder can re-trigger
            if (action === 'Undo') {
                const todayDateStr = new Date().toDateString();
                const notifiedKey = `notified_${medicineId}_${todayDateStr}_${reminderTime}`;
                sessionStorage.removeItem(notifiedKey);
            }

            // Update state locally
            setTodaySchedule((prev) =>
                prev.map((item) =>
                    item._id === medicineId && item.reminderTime === reminderTime
                        ? { ...item, loggedAction: action === 'Undo' ? null : action }
                        : item
                )
            );

            // Clear active alert if it matches
            if (activeAlert && activeAlert._id === medicineId && activeAlert.reminderTime === reminderTime) {
                setActiveAlert(null);
            }

            // Re-fetch to update other states/statistics
            fetchTodaySchedule();
        } catch (err) {
            console.error('Failed to log reminder action:', err);
        }
    };

    // Check reminders loop
    useEffect(() => {
        if (!user) {
            setTodaySchedule([]);
            setActiveAlert(null);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        // Initial fetch
        fetchTodaySchedule();
        requestNotificationPermission();

        // Set check interval every 20 seconds
        intervalRef.current = setInterval(() => {
            const now = new Date();
            const currentHour = String(now.getHours()).padStart(2, '0');
            const currentMin = String(now.getMinutes()).padStart(2, '0');
            const currentTimeStr = `${currentHour}:${currentMin}`;
            const todayDateStr = now.toDateString(); // For unique key check

            scheduleRef.current.forEach((med) => {
                // If the reminder is due now AND has not been logged yet
                if (med.reminderTime === currentTimeStr && !med.loggedAction) {
                    const notifiedKey = `notified_${med._id}_${todayDateStr}_${med.reminderTime}`;

                    // Check if already notified in this minute
                    if (!sessionStorage.getItem(notifiedKey)) {
                        sessionStorage.setItem(notifiedKey, 'true');

                        // Trigger UI card alert
                        setActiveAlert(med);

                        // 🔔 Play alarm sound
                        startAlarm();

                        // Trigger OS/Browser-level notification
                        const title = `Time to take ${med.medicineName}!`;
                        const body = `Dosage: ${med.dosage} (${med.type}). Time: ${med.reminderTime}`;

                        const browserNote = showBrowserNotification(title, {
                            body,
                            tag: `${med._id}_${med.reminderTime}`,
                            requireInteraction: true,
                        });

                        if (browserNote) {
                            browserNote.onclick = () => {
                                window.focus();
                                setActiveAlert(med);
                            };
                        }
                    }
                }
            });
        }, 20000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [user]);

    return (
        <ReminderContext.Provider
            value={{
                todaySchedule,
                activeAlert,
                setActiveAlert,
                loadingSchedule,
                fetchTodaySchedule,
                logReminderAction,
                stopAlarm,
                snoozeAlert,
            }}
        >
            {children}
        </ReminderContext.Provider>
    );
};

export const useReminder = () => {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error('useReminder must be used within a ReminderProvider');
    }
    return context;
};

import Medicine from '../models/Medicine.js';
import History from '../models/History.js';

// Helper to check status and sync
const updateMedicineStatus = (medicine) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(medicine.endDate);
    end.setHours(0, 0, 0, 0);

    if (end < today && medicine.status === 'Active') {
        medicine.status = 'Expired';
    }
    return medicine;
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get all active medicines of the user
        const medicines = await Medicine.find({ userId });

        // Auto-update status for list
        await Promise.all(
            medicines.map(async (med) => {
                const checked = updateMedicineStatus(med);
                if (checked.isModified('status')) {
                    await checked.save();
                }
            })
        );

        const activeMedicines = medicines.filter((m) => m.status === 'Active');
        const totalMedicines = medicines.length;

        // 2. Identify medicines scheduled for TODAY
        const today = new Date();
        const todayMidnight = new Date(today);
        todayMidnight.setHours(0, 0, 0, 0);

        const todayMedicines = [];
        for (let med of activeMedicines) {
            const start = new Date(med.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(med.endDate);
            end.setHours(0, 0, 0, 0);

            if (todayMidnight >= start && todayMidnight <= end) {
                let isScheduled = false;

                if (med.frequency === 'Daily' || med.frequency === 'Twice Daily') {
                    isScheduled = true;
                } else if (med.frequency === 'Weekly') {
                    if (todayMidnight.getDay() === start.getDay()) {
                        isScheduled = true;
                    }
                } else if (med.frequency === 'Monthly') {
                    if (todayMidnight.getDate() === start.getDate()) {
                        isScheduled = true;
                    }
                }

                if (isScheduled) {
                    todayMedicines.push(med);
                }
            }
        }

        // Sort today's medicines by reminderTime
        todayMedicines.sort((a, b) => a.reminderTime.localeCompare(b.reminderTime));

        // 3. Find History logs for TODAY
        const todayLogs = await History.find({
            userId,
            date: todayMidnight,
        });

        // Create a map of logged inputs for easy check
        // key: medicineId_reminderTime -> action
        const loggedMap = new Map();
        todayLogs.forEach((log) => {
            loggedMap.set(`${log.medicineId.toString()}_${log.reminderTime}`, log.action);
        });

        // Calculate today statistics
        let takenTodayCount = 0;
        let missedTodayCount = 0;
        let skippedTodayCount = 0;

        todayLogs.forEach((log) => {
            if (log.action === 'Taken') takenTodayCount++;
            else if (log.action === 'Missed') missedTodayCount++;
            else if (log.action === 'Skipped') skippedTodayCount++;
        });

        // 4. Calculate Medication Adherence Percentage overall
        // Adherence = (Taken / (Taken + Missed)) * 100
        // Skip does not count as missed, or it can. Let's make: Taken / (Taken + Missed)
        const allHistory = await History.find({ userId });
        let totalTaken = 0;
        let totalTracked = 0; // Taken + Missed

        allHistory.forEach((log) => {
            if (log.action === 'Taken') {
                totalTaken++;
                totalTracked++;
            } else if (log.action === 'Missed') {
                totalTracked++;
            }
        });

        const adherenceRate = totalTracked > 0 ? Math.round((totalTaken / totalTracked) * 100) : 100;

        // 5. Calculate Next Reminder today
        const currentHourString = String(today.getHours()).padStart(2, '0');
        const currentMinString = String(today.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHourString}:${currentMinString}`;

        let nextReminder = null;
        for (let med of todayMedicines) {
            // Find the first reminder in sorted list that is in the future
            if (med.reminderTime > currentTimeStr) {
                // Also check if they already took or skipped it
                const loggedAction = loggedMap.get(`${med._id.toString()}_${med.reminderTime}`);
                if (!loggedAction) {
                    nextReminder = {
                        medicineName: med.medicineName,
                        reminderTime: med.reminderTime,
                        dosage: med.dosage,
                        type: med.type,
                    };
                    break;
                }
            }
        }

        // If no future reminder today, look for the first scheduled reminder overall today that isn't logged (just in case they missed it)
        if (!nextReminder) {
            for (let med of todayMedicines) {
                const loggedAction = loggedMap.get(`${med._id.toString()}_${med.reminderTime}`);
                if (!loggedAction) {
                    nextReminder = {
                        medicineName: med.medicineName,
                        reminderTime: med.reminderTime,
                        dosage: med.dosage,
                        type: med.type,
                        overdue: true,
                    };
                    break;
                }
            }
        }

        // 5b. Weekly adherence (last 7 days)
        const sevenDaysAgo = new Date(todayMidnight);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const weeklyHistory = await History.find({
            userId,
            date: { $gte: sevenDaysAgo, $lte: todayMidnight },
        });
        let weeklyTaken = 0, weeklyTracked = 0;
        weeklyHistory.forEach((log) => {
            if (log.action === 'Taken') { weeklyTaken++; weeklyTracked++; }
            else if (log.action === 'Missed') weeklyTracked++;
        });
        const weeklyAdherenceRate = weeklyTracked > 0 ? Math.round((weeklyTaken / weeklyTracked) * 100) : 100;

        // 5c. Low stock alerts (stock > 0 && stock <= 5)
        const lowStockMedicines = activeMedicines
            .filter((m) => m.stock > 0 && m.stock <= 5)
            .map((m) => ({ _id: m._id, medicineName: m.medicineName, stock: m.stock }));

        res.json({
            todayMedicinesCount: todayMedicines.length,
            nextReminder,
            totalMedicines,
            takenTodayCount,
            missedTodayCount,
            skippedTodayCount,
            adherenceRate,
            weeklyAdherenceRate,
            lowStockMedicines,
            todaySchedule: todayMedicines.map((m) => {
                const loggedAction = loggedMap.get(`${m._id.toString()}_${m.reminderTime}`) || null;
                return {
                    _id: m._id,
                    medicineName: m.medicineName,
                    dosage: m.dosage,
                    type: m.type,
                    frequency: m.frequency,
                    reminderTime: m.reminderTime,
                    status: m.status,
                    stock: m.stock,
                    loggedAction, // Taken, Missed, Skipped, or null
                };
            }),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

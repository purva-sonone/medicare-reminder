import History from '../models/History.js';
import Medicine from '../models/Medicine.js';

// @desc    Log medicine action (taken, missed, skipped)
// @route   POST /api/history
// @access  Private
export const logHistory = async (req, res) => {
    try {
        const { medicineId, date, reminderTime, action } = req.body;

        if (!medicineId || !date || !reminderTime || !action) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Verify medicine exists and belongs to user
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        if (medicine.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to log history for this medicine' });
        }

        // Normalize date to midnight (00:00:00)
        const logDate = new Date(date);
        logDate.setHours(0, 0, 0, 0);

        // Look for existing history log for the same medicine, date, and reminder time
        let historyItem = await History.findOne({
            userId: req.user._id,
            medicineId,
            date: logDate,
            reminderTime,
        });

        // Handle UNDO: delete the existing log so it returns to pending state
        if (action === 'Undo') {
            if (historyItem) {
                // If it was "Taken", restore the stock
                if (historyItem.action === 'Taken') {
                    medicine.stock = Math.max(0, (medicine.stock || 0) + 1);
                    await medicine.save();
                }
                await historyItem.deleteOne();
                return res.json({ message: 'Log removed. Medicine is now pending.', undone: true });
            }
            return res.json({ message: 'No log found to undo.', undone: false });
        }

        if (historyItem) {
            // Update action if it already exists
            const oldAction = historyItem.action;
            if (oldAction !== 'Taken' && action === 'Taken') {
                medicine.stock = Math.max(0, (medicine.stock || 0) - 1);
                await medicine.save();
            } else if (oldAction === 'Taken' && action !== 'Taken') {
                medicine.stock = Math.max(0, (medicine.stock || 0) + 1);
                await medicine.save();
            }
            historyItem.action = action;
            await historyItem.save();
            return res.json(historyItem);
        }

        // Otherwise, create new history item
        historyItem = new History({
            userId: req.user._id,
            medicineId,
            date: logDate,
            reminderTime,
            action,
        });

        // Decrement stock if first time marking as Taken
        if (action === 'Taken') {
            medicine.stock = Math.max(0, (medicine.stock || 0) - 1);
            await medicine.save();
        }

        const savedHistory = await historyItem.save();
        res.status(201).json(savedHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's history with query filters
// @route   GET /api/history
// @access  Private
export const getHistory = async (req, res) => {
    try {
        const { status, search, range } = req.query;

        // Base query
        let query = { userId: req.user._id };

        // Filter by action (status) if provided
        if (status && status !== 'all') {
            query.action = status;
        }

        // Filter by date range if provided
        if (range && range !== 'all') {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            let startDate = new Date();

            if (range === 'daily') {
                startDate.setHours(0, 0, 0, 0);
            } else if (range === 'weekly') {
                startDate.setDate(today.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
            } else if (range === 'monthly') {
                startDate.setMonth(today.getMonth() - 1);
                startDate.setHours(0, 0, 0, 0);
            }

            query.date = { $gte: startDate, $lte: today };
        }

        // Get matching history and populate medicine details
        let history = await History.find(query)
            .populate('medicineId', 'medicineName dosage type frequency notes')
            .sort({ date: -1, reminderTime: -1 });

        // Client-side search filters details
        if (search && search.trim() !== '') {
            const searchTerms = search.toLowerCase();
            history = history.filter((log) => {
                // If medicineId ref is null (should not be unless medicine was deleted), skip or check
                if (!log.medicineId) return false;

                return (
                    log.medicineId.medicineName.toLowerCase().includes(searchTerms) ||
                    log.action.toLowerCase().includes(searchTerms) ||
                    log.reminderTime.includes(searchTerms)
                );
            });
        }

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

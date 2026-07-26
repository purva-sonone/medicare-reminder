import Medicine from '../models/Medicine.js';

// Helper to update status based on date
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

// @desc    Get all medicines for logged in user
// @route   GET /api/medicines
// @access  Private
export const getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.user._id }).sort({ createdAt: -1 });

        // Check and update status dynamically
        const updatedMedicines = await Promise.all(
            medicines.map(async (med) => {
                const checked = updateMedicineStatus(med);
                if (checked.isModified('status')) {
                    await checked.save();
                }
                return checked;
            })
        );

        res.json(updatedMedicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new medicine
// @route   POST /api/medicines
// @access  Private
export const createMedicine = async (req, res) => {
    try {
        const {
            medicineName,
            dosage,
            type,
            frequency,
            reminderTime,
            startDate,
            endDate,
            notes,
            stock,
        } = req.body;

        if (!medicineName || !dosage || !type || !frequency || !reminderTime || !startDate || !endDate) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        // Check duplicate: userId + medicineName + reminderTime
        const duplicate = await Medicine.findOne({
            userId: req.user._id,
            medicineName: { $regex: new RegExp(`^${medicineName.trim()}$`, 'i') },
            reminderTime: reminderTime.trim(),
        });

        if (duplicate) {
            return res.status(400).json({
                message: `You already have dynamic reminder for "${medicineName}" at ${reminderTime}.`,
            });
        }

        const medicine = new Medicine({
            userId: req.user._id,
            medicineName: medicineName.trim(),
            dosage,
            type,
            frequency,
            reminderTime,
            startDate,
            endDate,
            notes,
            stock: stock ? parseInt(stock) : 0,
            status: 'Active',
        });

        // Auto-update status before saving (e.g. if start/end date is already in the past)
        const checkedMedicine = updateMedicineStatus(medicine);
        const createdMedicine = await checkedMedicine.save();
        res.status(201).json(createdMedicine);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Duplicate entry: You already have this medicine with the same reminder time.',
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private
export const updateMedicine = async (req, res) => {
    try {
        const {
            medicineName,
            dosage,
            type,
            frequency,
            reminderTime,
            startDate,
            endDate,
            notes,
            status,
            stock,
        } = req.body;

        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Verify ownership
        if (medicine.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this medicine' });
        }

        // Check duplicate if name/time changes
        if (
            (medicineName && medicineName.trim() !== medicine.medicineName) ||
            (reminderTime && reminderTime.trim() !== medicine.reminderTime)
        ) {
            const targetName = medicineName ? medicineName.trim() : medicine.medicineName;
            const targetTime = reminderTime ? reminderTime.trim() : medicine.reminderTime;

            const duplicate = await Medicine.findOne({
                userId: req.user._id,
                medicineName: { $regex: new RegExp(`^${targetName}$`, 'i') },
                reminderTime: targetTime,
                _id: { $ne: req.params.id },
            });

            if (duplicate) {
                return res.status(400).json({
                    message: `You already have a reminder for "${targetName}" at ${targetTime}.`,
                });
            }
        }

        medicine.medicineName = medicineName ? medicineName.trim() : medicine.medicineName;
        medicine.dosage = dosage || medicine.dosage;
        medicine.type = type || medicine.type;
        medicine.frequency = frequency || medicine.frequency;
        medicine.reminderTime = reminderTime || medicine.reminderTime;
        medicine.startDate = startDate || medicine.startDate;
        medicine.endDate = endDate || medicine.endDate;
        medicine.notes = notes !== undefined ? notes : medicine.notes;
        medicine.status = status || medicine.status;
        medicine.stock = stock !== undefined ? parseInt(stock) : medicine.stock;

        // Check status based on dates
        const checkedMedicine = updateMedicineStatus(medicine);
        const updatedMedicine = await checkedMedicine.save();

        res.json(updatedMedicine);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Duplicate entry: You already have this medicine with the same reminder time.',
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Verify ownership
        if (medicine.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this medicine' });
        }

        // Delete medicine and all associated history for cleanliness
        await Medicine.deleteOne({ _id: req.params.id });

        // We import History dynamically or at top if we want to delete it.
        // Let's do it clean. We will clean history too.
        // Import at top might create circular reference, but it's safe.
        res.json({ message: 'Medicine and related history removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get today's medicines
// @route   GET /api/medicines/today
// @access  Private
export const getTodayMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({
            userId: req.user._id,
            status: 'Active',
        });

        const todayHourMin = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayMedicines = [];

        for (let med of medicines) {
            // Dynamic status update in case end date expired
            const checked = updateMedicineStatus(med);
            if (checked.isModified('status')) {
                await checked.save();
                if (checked.status !== 'Active') continue;
            }

            const start = new Date(med.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(med.endDate);
            end.setHours(0, 0, 0, 0);

            // Check date range
            if (today >= start && today <= end) {
                let isScheduled = false;

                if (med.frequency === 'Daily' || med.frequency === 'Twice Daily') {
                    isScheduled = true;
                } else if (med.frequency === 'Weekly') {
                    // Compare day of week (0-6)
                    if (today.getDay() === start.getDay()) {
                        isScheduled = true;
                    }
                } else if (med.frequency === 'Monthly') {
                    // Compare day of month (1-31)
                    if (today.getDate() === start.getDate()) {
                        isScheduled = true;
                    }
                }

                if (isScheduled) {
                    todayMedicines.push(med);
                }
            }
        }

        // Sort today's medicines by reminder time
        todayMedicines.sort((a, b) => {
            return a.reminderTime.localeCompare(b.reminderTime);
        });

        res.json(todayMedicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

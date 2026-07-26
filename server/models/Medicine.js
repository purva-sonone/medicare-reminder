import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        medicineName: {
            type: String,
            required: [true, 'Please provide the medicine name'],
            trim: true,
        },
        dosage: {
            type: String,
            required: [true, 'Please provide the dosage (e.g. 1 pill, 5ml)'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Please select the medicine type'],
            enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Other'],
            default: 'Tablet',
        },
        frequency: {
            type: String,
            required: [true, 'Please select the frequency'],
            enum: ['Daily', 'Twice Daily', 'Weekly', 'Monthly'],
            default: 'Daily',
        },
        reminderTime: {
            type: String,
            required: [true, 'Please select a reminder time (e.g. 08:00)'],
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, 'Please select a start date'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please select an end date'],
        },
        notes: {
            type: String,
            trim: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Expired'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// We need a pre-save/pre-validate to check if the end date has passed, but we can also set the status dynamically or via queries.
// Let's create an index for checking duplicates: userId + medicineName + reminderTime
medicineSchema.index({ userId: 1, medicineName: 1, reminderTime: 1 }, { unique: true });

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;

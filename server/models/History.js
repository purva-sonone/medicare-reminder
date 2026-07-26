import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
    {
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        reminderTime: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            enum: ['Taken', 'Missed', 'Skipped'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexing for faster history lookup by userId and date ranges
historySchema.index({ userId: 1, date: -1 });

const History = mongoose.model('History', historySchema);

export default History;

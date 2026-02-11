import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: [true, 'Activity name is required'],
        trim: true
    },
    from: {
        type: Date,
        required: [true, 'Start time is required']
    },
    to: {
        type: Date,
        required: [true, 'End time is required']
    },
    type: {
        type: String,
        enum: ['GENERAL', 'DEV', 'EVALUATION', 'BREAK', 'FINAL'],
        default: 'GENERAL'
    }
}, {
    timestamps: true
});

// Index for efficient time-based queries
timelineSchema.index({ from: 1, to: 1 });

const Timeline = mongoose.model('Timeline', timelineSchema);

export default Timeline;

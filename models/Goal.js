const mongoose = require("mongoose");
const dayjs = require('dayjs');

const GoalSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true },
    title: {type: String, 
        required: true },
    description: {type: String },
    goalType: {type: String, 
        enum: ['timed', 'daily'], 
        required: true },
    target: {type: Number, 
        required: true },
    progress: {type: Number, 
        default: 0 },
    startDate: {type: Date, 
        default: dayjs().toDate() },
    endDate: {type: Date, 
        required: true },
    createdAt: {type: Date, 
        default: Date.now },
    streak: {type: Number, 
        default: 0},
    lastLogDate: {type: Date}
});

module.exports = mongoose.model("Goal", GoalSchema);
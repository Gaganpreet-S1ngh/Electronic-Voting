import mongoose from "mongoose";


const voterSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        unique: true,
    },

    hasVoted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });



export const Voter = mongoose.model("Voter", voterSchema);



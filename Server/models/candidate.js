import mongoose from "mongoose";


const candidateSchema = new mongoose.Schema({
    candidateEnc: {
        type: String,
        requried: true,
        unique: true,
    },

    votes: {
        type: Number,
        default: 0
    }


}, { timestamps: true });



export const Candidate = mongoose.model("Candidate", candidateSchema);
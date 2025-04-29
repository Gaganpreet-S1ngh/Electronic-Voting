import mongoose from "mongoose";


export const connectToDB = async (db_url) => {
    try {
        await mongoose.connect(db_url).then(() => {
            console.log("Connected to DB!");
        })
    } catch (error) {
        console.log("error in connection to DB => ", error);
    }
}
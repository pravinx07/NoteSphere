import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


export const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected Successfully !! HOST: ${connectionInstance.connection.host}/${DB_NAME}`);
        
    } catch (error) {
        console.log("Database connection failed..");
        process.exit(1)
        
    }
}
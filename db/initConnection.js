import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const initConnection = () => {
    const mongodbURI = process.env.MONGODB_URI; // Retrieve MongoDB connection string from environment variable

    return mongoose.connect(mongodbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));
}

export default initConnection;

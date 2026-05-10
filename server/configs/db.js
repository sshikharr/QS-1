import mongoose from "mongoose";

const connectDB = async () => {
    // Disable buffering so we don't get those 10s timeouts
    mongoose.set('bufferCommands', false);
    mongoose.set('strictQuery', true);

    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(`mongodb+srv://shikhar_dwivedi:aWLAnznvdTgsww0y@cluster0.e5dlnhf.mongodb.net`, {
            dbName: 'hotel-booking',
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw error;
    }
};

export default connectDB;
// Note: Do not use the '@' symbol in your database user's password.
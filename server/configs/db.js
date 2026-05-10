import mongoose from "mongoose";

const connectDB = async () => {
    console.log("--- DB CONNECTION START ---");
    console.log("Current state:", mongoose.connection.readyState);

    // Disable buffering so we don't get those 10s timeouts
    mongoose.set('bufferCommands', false);
    mongoose.set('strictQuery', true);

    if (mongoose.connection.readyState === 1) {
        console.log("Status: Already connected. Reusing connection.");
        return;
    }

    try {
        console.log("Status: Attempting new connection to Atlas...");
        const conn = await mongoose.connect(`mongodb+srv://shikhar_dwivedi:aWLAnznvdTgsww0y@cluster0.e5dlnhf.mongodb.net`, {
            dbName: 'hotel-booking',
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("Status: Successfully connected to host:", conn.connection.host);
        console.log("--- DB CONNECTION SUCCESS ---");
    } catch (error) {
        console.error("--- DB CONNECTION ERROR ---");
        console.error("Error Message:", error.message);
        console.error("Error Code:", error.code);
        throw error;
    }
};

export default connectDB;
// Note: Do not use the '@' symbol in your database user's password.
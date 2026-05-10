import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        mongoose.connection.on('error', (err) => console.error("Database Connection Error:", err));
        
        // Hardcoded URI for immediate resolution
        await mongoose.connect(`mongodb+srv://shikhar_dwivedi:aWLAnznvdTgsww0y@cluster0.e5dlnhf.mongodb.net/hotel-booking`);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
    }
};

export default connectDB;
// Note: Do not use the '@' symbol in your database user's password.
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(`mongodb+srv://shikhar_dwivedi:aWLAnznvdTgsww0y@cluster0.e5dlnhf.mongodb.net/hotel-booking`);
        
        isConnected = db.connections[0].readyState;
        console.log("Database Connected");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw error; // Throw so the middleware can catch it
    }
};

export default connectDB;
// Note: Do not use the '@' symbol in your database user's password.
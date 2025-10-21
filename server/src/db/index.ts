import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://programmershorif_db_user:DxH4QIix1iX0oEhN@leadsko.7fosdmg.mongodb.net/?retryWrites=true&w=majority&appName=Leadsko`
    );
    console.log(`\n  Database connected! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;

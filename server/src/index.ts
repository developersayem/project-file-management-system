import dotenv from "dotenv";
import connectDB from "./db/index";
import { app } from "./app";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  });

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error.message}\n${error.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

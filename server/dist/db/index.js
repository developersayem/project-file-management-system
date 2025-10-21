"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose_1.default.connect(`mongodb+srv://programmershorif_db_user:DxH4QIix1iX0oEhN@leadsko.7fosdmg.mongodb.net/?retryWrites=true&w=majority&appName=Leadsko`);
        console.log(`\n  Database connected! DB Host: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.error("❌ Database connection failed", error);
        process.exit(1); // Exit the process with failure
    }
};
exports.default = connectDB;

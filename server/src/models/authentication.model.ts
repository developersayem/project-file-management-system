import mongoose, { Schema, Document } from "mongoose";

export interface IAuthentication extends Document {
  password: string;
  isEnabled: boolean;
  isAirplaneModeEnabled: boolean;
}

const MarqueeSchema = new Schema<IAuthentication>(
  {
    password: { type: String, required: true },
    isEnabled: { type: Boolean, default: false },
    isAirplaneModeEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Authentication= mongoose.model<IAuthentication>("Authentication", MarqueeSchema);

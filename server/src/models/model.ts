import mongoose, { Schema, Document } from "mongoose";

export interface IMarquee extends Document {
  text:string
  bgColor:string
  color:string
}

const MarqueeSchema = new Schema<IMarquee>(
  {
    text: { type: String, required: true },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export const Marquee= mongoose.model<IMarquee>("Marquee", MarqueeSchema);

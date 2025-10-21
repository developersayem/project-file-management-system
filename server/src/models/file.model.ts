import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFile extends Document {
  name: string;
  folder: Types.ObjectId;
  price: string;
  numbers:number;
  currency: string;
}

const FileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true, trim: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
    price: { type: String, required: true },
    numbers: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { timestamps: true }
);

export const File = mongoose.model<IFile>("File", FileSchema);

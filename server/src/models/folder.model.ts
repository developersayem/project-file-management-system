import mongoose, { Schema, Document, Types } from "mongoose";

// ---------- TypeScript Interfaces ----------
export interface IFolder extends Document {
  name: string;
  files: Types.ObjectId[]; // ✅ Correct type for references
}

// ---------- Schema ----------
const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

// ---------- Export Model ----------
export const Folder = mongoose.model<IFolder>("Folder", FolderSchema);

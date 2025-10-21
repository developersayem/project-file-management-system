import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFolder extends Document {
  name: string;
  parentFolder?: Types.ObjectId | null; // null means it's a root folder
  files: Types.ObjectId[]; // all files inside this folder
}

const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null, // root folder has no parent
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

export const Folder = mongoose.model<IFolder>("Folder", FolderSchema);

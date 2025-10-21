import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { File } from "../models/file.model";
import { Folder } from "../models/folder.model";

// CREATE FILE
const createFile = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, numbers, currency, folder } = req.body;

  if (!name) throw new ApiError(400, "File name is required");
  if (!price) throw new ApiError(400, "File price is required");
  if (!folder) throw new ApiError(400, "File folder is required");

  // Check folder existence by ID
  const folderExists = await Folder.findById(folder);
  if (!folderExists) throw new ApiError(400, "Folder does not exist");

  // Optional: check for duplicate file in same folder
  const exists = await File.findOne({ name, folder });
  if (exists) throw new ApiError(400, "File with this name already exists in the folder");

  // Create file
  const file = await File.create({ name, folder, price, numbers, currency });

  // Add file reference to folder
  await Folder.findByIdAndUpdate(folder, { $push: { files: file._id } });

  res.status(201).json(new ApiResponse(201, file, "File created successfully"));
});

// EDIT FILE
const editFile = asyncHandler(async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const { name, price, numbers, currency } = req.body;

  if (!fileId) throw new ApiError(400, "File ID is required");
  if (!name) throw new ApiError(400, "File name is required");

  const updatedFile = await File.findByIdAndUpdate(
    fileId,
    { name, price, numbers, currency },
    { new: true }
  );

  if (!updatedFile) throw new ApiError(404, "File not found");

  res.status(200).json(new ApiResponse(200, updatedFile, "File updated successfully"));
});

// DELETE FILE
const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const fileId = req.params.id;
  if (!fileId) throw new ApiError(400, "File ID is required");

  const file = await File.findById(fileId);
  if (!file) throw new ApiError(404, "File not found");

  // Remove file reference from folder
  await Folder.findByIdAndUpdate(file.folder, { $pull: { files: file._id } });

  // Delete file
  await File.findByIdAndDelete(fileId);

  res.status(200).json(new ApiResponse(200, null, "File deleted successfully"));
});

export { createFile, editFile, deleteFile };

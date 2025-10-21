import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";

/**
 * @desc Get all folders (optionally nested)
 */
export const getFolders = asyncHandler(async (req: Request, res: Response) => {
  const folders = await Folder.find().populate("files");
  if (!folders || folders.length === 0) {
    throw new ApiError(404, "No folders found");
  }

  res.status(200).json(new ApiResponse(200, folders, "Folders fetched successfully"));
});

/**
 * @desc Create new folder (can be root or subfolder)
 */
export const createFolder = asyncHandler(async (req: Request, res: Response) => {
  const { name, parentFolder } = req.body;

  console.log("req.body:",req.body)
  console.log("parentFolder:",parentFolder)

  if (!name?.trim()) throw new ApiError(400, "Folder name is required");

  // Optional: ensure unique name within the same parent
  const exists = await Folder.findOne({ name, parentFolder: parentFolder || null });
  if (exists) throw new ApiError(400, "Folder with this name already exists in the parent folder");

  const folder = await Folder.create({
    name: name.trim(),
    parentFolder: parentFolder || null,
    files: [],
  });
console.log(exists)
  res.status(201).json(new ApiResponse(201, "folder", "Folder created successfully"));
});

/**
 * @desc Edit folder name
 */
export const editFolder = asyncHandler(async (req: Request, res: Response) => {
  const folderId = req.params.id;
  const { name } = req.body;

  if (!folderId) throw new ApiError(400, "Folder ID is required");
  if (!name?.trim()) throw new ApiError(400, "Folder name is required");

  const updated = await Folder.findByIdAndUpdate(
    folderId,
    { name: name.trim() },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "Folder not found");

  res.status(200).json(new ApiResponse(200, updated, "Folder updated successfully"));
});

/**
 * @desc Delete folder (and its files + subfolders recursively)
 */
export const deleteFolder = asyncHandler(async (req: Request, res: Response) => {
  const folderId = req.params.id;
  if (!folderId) throw new ApiError(400, "Folder ID is required");

  const folder = await Folder.findById(folderId);
  if (!folder) throw new ApiError(404, "Folder not found");

  // Recursive delete of subfolders
async function deleteSubfolders(parentId: string) {
  const subfolders = await Folder.find({ parentFolder: parentId });
  for (const sub of subfolders) {
    await File.deleteMany({ folder: sub._id });
    await deleteSubfolders(sub._id as string);
    await Folder.findByIdAndDelete(sub._id);
  }
}

  await File.deleteMany({ folder: folder._id }); // delete files inside this folder
  await deleteSubfolders(folder._id as string);
  await Folder.findByIdAndDelete(folder._id);

  res.status(200).json(new ApiResponse(200, null, "Folder and its contents deleted successfully"));
});

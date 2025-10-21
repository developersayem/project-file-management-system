import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { File } from "../models/file.model";
import { Folder } from "../models/folder.model";

/**
 * @desc Create a file inside a folder
 */
export const createFile = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, numbers, currency, folder, icon } = req.body;
  console.log(req.body)


  if (!name?.trim()) throw new ApiError(400, "File name is required");
  if (price === undefined || price === null) throw new ApiError(400, "File price is required");
  if (!numbers && numbers !== 0) throw new ApiError(400, "Numbers are required");
  if (!currency?.trim()) throw new ApiError(400, "Currency is required");
  if (!folder) throw new ApiError(400, "Folder ID is required");
  if (!icon?.trim()) throw new ApiError(400, "File type/icon is required");

  const folderExists = await Folder.findById(folder);
  if (!folderExists) throw new ApiError(400, "Folder does not exist");

  // Prevent duplicates in same folder
  const exists = await File.findOne({ name: name.trim(), folder });
  if (exists) throw new ApiError(400, "File with this name already exists in the folder");

  const file = await File.create({
    name: name.trim(),
    folder,
    price: price.toString(), // Store as string to match schema
    numbers,
    currency,
    icon,
  });

  await Folder.findByIdAndUpdate(folder, { $push: { files: file._id } });

  res.status(201).json(new ApiResponse(201, file, "File created successfully"));
});

/**
 * @desc Edit file details
 */
export const editFile = asyncHandler(async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const { name, price, numbers, currency, icon } = req.body;

  if (!fileId) throw new ApiError(400, "File ID is required");
  if (!name?.trim()) throw new ApiError(400, "File name is required");
  if (price === undefined || price === null) throw new ApiError(400, "File price is required");
  if (!numbers && numbers !== 0) throw new ApiError(400, "Numbers are required");
  if (!currency?.trim()) throw new ApiError(400, "Currency is required");
  if (!icon?.trim()) throw new ApiError(400, "File type/icon is required");

  const updated = await File.findByIdAndUpdate(
    fileId,
    {
      name: name.trim(),
      price: price.toString(),
      numbers,
      currency,
      icon,
    },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "File not found");

  res.status(200).json(new ApiResponse(200, updated, "File updated successfully"));
});
/**
 * @desc Delete a file
 */
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const fileId = req.params.id;
  if (!fileId) throw new ApiError(400, "File ID is required");

  const file = await File.findById(fileId);
  if (!file) throw new ApiError(404, "File not found");

  await Folder.findByIdAndUpdate(file.folder, { $pull: { files: file._id } });
  await File.findByIdAndDelete(file._id);

  res.status(200).json(new ApiResponse(200, null, "File deleted successfully"));
});

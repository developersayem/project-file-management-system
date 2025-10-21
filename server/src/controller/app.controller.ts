import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Folder, IFolder } from "../models/folder.model";
import { File, IFile } from "../models/file.model";
import { Marquee } from "../models/model";
import {  Types } from "mongoose";


// Define a recursive type for folder details
interface FolderDetails {
  _id: Types.ObjectId;
  name: string;
  files: Types.ObjectId[];
  totalLeads: number;
  fileCount: number;
  subfolderCount: number;
  subfolders: FolderDetails[];
  displayCount: number;
  countType: "files" | "folders";
}

/**
 * GET /api/folder/:folderId
 * Fetch a specific folder with all files inside, including total leads.
 */
const getFolderLeads = async (folderId: Types.ObjectId): Promise<number> => {
  const files = await File.find({ folder: folderId }).lean();
  const subfolders = await Folder.find({ parentFolder: folderId }).lean();

  const subfolderLeads = await Promise.all(
    subfolders.map((sub) => getFolderLeads(sub._id as Types.ObjectId))
  );

  const totalLeads =
    files.reduce((sum, f) => sum + (f.numbers || 0), 0) +
    subfolderLeads.reduce((sum, l) => sum + l, 0);

  return totalLeads;
};

export const getFolderWithFiles = asyncHandler(async (req: Request, res: Response) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError(400, "Folder ID is required");

  const folder = await Folder.findById(folderId).lean();
  if (!folder) throw new ApiError(404, "Folder not found");

  const files = await File.find({ folder: folder._id }).lean();
  const totalLeads = await getFolderLeads(folder._id as Types.ObjectId);

  const responseData = {
    _id: folder._id,
    name: folder.name,
    leads: totalLeads,
    files: files.map((f) => ({
      _id: f._id,
      name: f.name,
      price: Number(f.price),
      numbers: f.numbers,
      currency: f.currency,
      icon: f.icon,
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Folder and files fetched successfully"));
});


export const getFoldersWithCounts = asyncHandler(async (req: Request, res: Response) => {
  // Find all root folders (those without a parent)
  const rootFolders = await Folder.find({ parentFolder: null });

  // Define the recursive function with explicit return type
const getFolderDetails = async (folder: IFolder): Promise<FolderDetails> => {
  const files: IFile[] = await File.find({ folder: folder._id });
  const subfolders: IFolder[] = await Folder.find({ parentFolder: folder._id });

  const subfolderDetails: FolderDetails[] = await Promise.all(
    subfolders.map((sub) => getFolderDetails(sub))
  );

  const hasSubfolders = subfolders.length > 0;

  // Only sum files if no subfolders, else sum subfolder totalLeads
  const totalLeads = hasSubfolders
    ? subfolderDetails.reduce((sum, sub) => sum + sub.totalLeads, 0)
    : files.reduce((sum, f) => sum + (f.numbers || 0), 0);

  const fileCount = hasSubfolders ? 0 : files.length;
  const subfolderCount = subfolders.length;

  const countType: "files" | "folders" = hasSubfolders ? "folders" : "files";
  const displayCount = hasSubfolders ? subfolderCount : files.length;

  return {
    _id: folder._id as Types.ObjectId,
    name: folder.name,
    files: files.map((f) => f._id) as Types.ObjectId[],
    totalLeads,
    fileCount,
    subfolderCount,
    subfolders: subfolderDetails,
    displayCount,
    countType,
  };
};

  // Build the tree for all root folders
  const data: FolderDetails[] = await Promise.all(rootFolders.map((f) => getFolderDetails(f)));

  res.status(200).json({
    statusCode: 200,
    data,
    message: "Folders with dynamic file/folder counts fetched successfully",
    success: true,
  });
});

/**
 * GET /api/folders
 * Fetch all folders with total lead counts (aggregated)
 */
export const getAllFoldersWithLeads = asyncHandler(async (req: Request, res: Response) => {
  const folders = await Folder.aggregate([
    {
      $lookup: {
        from: "files",
        localField: "_id",
        foreignField: "folder",
        as: "files",
      },
    },
    {
      $addFields: {
        leads: {
          $sum: {
            $map: {
              input: "$files",
              as: "file",
              in: { $ifNull: ["$$file.numbers", 0] },
            },
          },
        },
        fileCount: { $size: "$files" },
      },
    },
    {
      $project: {
        name: 1,
        leads: 1,
        fileCount: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, folders, "Folders with leads retrieved successfully"));
});

/**
 * GET /api/marquee
 * Fetch the latest marquee document
 */
export const getMarquee = asyncHandler(async (req: Request, res: Response) => {
  const marquee = await Marquee.findOne().sort({ createdAt: -1 }).lean();

  if (!marquee) throw new ApiError(404, "No marquee found");

  return res
    .status(200)
    .json(new ApiResponse(200, marquee, "Latest marquee fetched successfully"));
});

/**
 * PUT /api/marquee/:id
 * Update marquee text and colors
 */
export const updateMarquee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, bgColor, color } = req.body;

  if (!id) throw new ApiError(400, "Marquee ID is required");

  const updated = await Marquee.findByIdAndUpdate(
    id,
    { text, bgColor, color },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) throw new ApiError(404, "Marquee not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Marquee updated successfully"));
});
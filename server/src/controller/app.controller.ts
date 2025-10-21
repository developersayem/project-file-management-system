import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";
import { Marquee } from "../models/model";

/**
 * GET /api/folder/:folderId
 * Fetch a specific folder with all files inside, including total leads.
 */
export const getFolderWithFiles = asyncHandler(async (req: Request, res: Response) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError(400, "Folder ID is required");

  const folder = await Folder.findById(folderId).lean();
  if (!folder) throw new ApiError(404, "Folder not found");

  const files = await File.find({ folder: folder._id }).lean();

  const totalLeads = files.reduce((sum, file) => sum + (file.numbers || 0), 0);

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
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Folder and files fetched successfully"));
});

export const getFoldersWithStats = asyncHandler(async (req: Request, res: Response) => {
  // 1️⃣ Get all folders
  const folders = await Folder.find().lean();
  if (!folders.length) throw new ApiError(404, "No folders found");

  // 2️⃣ Get all files (to calculate leads and file counts efficiently)
  const files = await File.find({}, "folder numbers").lean();

  // 3️⃣ Create a map of folderId → { totalLeads, fileCount }
  const folderStats: Record<string, { totalLeads: number; fileCount: number }> = {};

  files.forEach((file) => {
    const folderId = file.folder?.toString();
    if (!folderId) return;

    if (!folderStats[folderId]) {
      folderStats[folderId] = { totalLeads: 0, fileCount: 0 };
    }

    folderStats[folderId].totalLeads += file.numbers || 0;
    folderStats[folderId].fileCount += 1;
  });

  // 4️⃣ Build response: each folder + its subfolders
  const folderMap: Record<string, any> = {};
  folders.forEach((folder) => {
    folderMap[folder._id.toString()] = {
      _id: folder._id,
      name: folder.name,
      parentFolder: folder.parentFolder,
      totalLeads: folderStats[folder._id.toString()]?.totalLeads || 0,
      fileCount: folderStats[folder._id.toString()]?.fileCount || 0,
      subfolders: [],
    };
  });

  // 5️⃣ Attach subfolders to their parents
  const rootFolders: any[] = [];
  folders.forEach((folder) => {
    if (folder.parentFolder) {
      const parent = folderMap[folder.parentFolder.toString()];
      if (parent) {
        parent.subfolders.push(folderMap[folder._id.toString()]);
      }
    } else {
      rootFolders.push(folderMap[folder._id.toString()]);
    }
  });

  // 6️⃣ Send response
  return res
    .status(200)
    .json(new ApiResponse(200, rootFolders, "Folders with subfolders and stats fetched successfully"));
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
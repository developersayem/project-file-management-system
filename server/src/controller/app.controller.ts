import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";
import { Marquee } from "../models/model";

// ✅ Get folder + all files under it (formatted)
export const getFolderWithFiles = asyncHandler(async (req: Request, res: Response) => {
  const { folderId } = req.params;

  if (!folderId) throw new ApiError(400, "Folder ID is required");

  // 🧩 1. Find folder
  const folder = await Folder.findById(folderId);
  if (!folder) throw new ApiError(404, "Folder not found");

  // 🧩 2. Find all files belonging to this folder
  const files = await File.find({ folder: folder._id });

  // 🧩 3. Calculate total leads (sum of all file.numbers)
  const totalLeads = files.reduce((sum, file) => sum + (file.numbers || 0), 0);

  // 🧩 4. Format response data
  const responseData = {
    _id: folder._id,
    name: folder.name,
    leads: totalLeads, // ✅ sum of all file.numbers
    files: files.map((f) => ({
      _id: f._id,
      name: f.name,
      price: Number(f.price),
      numbers: f.numbers,
      currency: f.currency,
    })),
  };

  // 🧩 5. Send response
  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Folder and files fetched successfully"));
});

export const getAllFoldersWithLeads = asyncHandler(async (req: Request, res: Response) => {
  const folders = await Folder.aggregate([
    {
      $lookup: {
        from: "files", // collection name
        localField: "_id",
        foreignField: "folder",
        as: "files",
      },
    },
    {
      $addFields: {
        // ✅ Sum of all `numbers` fields inside `files`
        leads: {
          $sum: {
            $map: {
              input: "$files",
              as: "file",
              in: { $ifNull: ["$$file.numbers", 0] },
            },
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        leads: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, folders, "Folders with leads retrieved successfully"));
});

// GET /api/marquee  → get the latest marquee
export const getMarquee = async (req: Request, res: Response) => {
  try {
    const marquee = await Marquee.findOne().sort({ createdAt: -1 });

    if (!marquee) {
      return res.status(404).json({ message: "No marquee found" });
    }

    res.status(200).json({ success: true, data: marquee });
  } catch (error) {
    console.error("Error fetching marquee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/marquee/:id  → edit marquee text/colors
export const updateMarquee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, bgColor, color } = req.body;

    const updated = await Marquee.findByIdAndUpdate(
      id,
      { text, bgColor, color },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Marquee not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating marquee:", error);
    res.status(500).json({ message: "Server error" });
  }
};
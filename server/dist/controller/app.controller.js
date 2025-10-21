"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarquee = exports.getMarquee = exports.getAllFoldersWithLeads = exports.getFolderWithFiles = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const folder_model_1 = require("../models/folder.model");
const file_model_1 = require("../models/file.model");
const model_1 = require("../models/model");
// ✅ Get folder + all files under it (formatted)
exports.getFolderWithFiles = (0, asyncHandler_1.default)(async (req, res) => {
    const { folderId } = req.params;
    if (!folderId)
        throw new ApiError_1.ApiError(400, "Folder ID is required");
    // 🧩 1. Find folder
    const folder = await folder_model_1.Folder.findById(folderId);
    if (!folder)
        throw new ApiError_1.ApiError(404, "Folder not found");
    // 🧩 2. Find all files belonging to this folder
    const files = await file_model_1.File.find({ folder: folder._id });
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
        .json(new ApiResponse_1.ApiResponse(200, responseData, "Folder and files fetched successfully"));
});
exports.getAllFoldersWithLeads = (0, asyncHandler_1.default)(async (req, res) => {
    const folders = await folder_model_1.Folder.aggregate([
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
        .json(new ApiResponse_1.ApiResponse(200, folders, "Folders with leads retrieved successfully"));
});
// GET /api/marquee  → get the latest marquee
const getMarquee = async (req, res) => {
    try {
        const marquee = await model_1.Marquee.findOne().sort({ createdAt: -1 });
        if (!marquee) {
            return res.status(404).json({ message: "No marquee found" });
        }
        res.status(200).json({ success: true, data: marquee });
    }
    catch (error) {
        console.error("Error fetching marquee:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMarquee = getMarquee;
// PUT /api/marquee/:id  → edit marquee text/colors
const updateMarquee = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, bgColor, color } = req.body;
        const updated = await model_1.Marquee.findByIdAndUpdate(id, { text, bgColor, color }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Marquee not found" });
        }
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        console.error("Error updating marquee:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateMarquee = updateMarquee;

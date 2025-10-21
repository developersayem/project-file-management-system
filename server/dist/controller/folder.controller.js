"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.editFolder = exports.createFolder = exports.getFolders = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const folder_model_1 = require("../models/folder.model");
const file_model_1 = require("../models/file.model");
const getFolders = (0, asyncHandler_1.default)(async (req, res) => {
    const folders = await folder_model_1.Folder.find();
    if (!folders)
        throw new ApiError_1.ApiError(404, "Folders not found");
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, folders, "Folders fetched successfully"));
});
exports.getFolders = getFolders;
const createFolder = (0, asyncHandler_1.default)(async (req, res) => {
    const { name } = req.body;
    console.log("req.body", req.body);
    console.log("name", name);
    if (!name)
        throw new ApiError_1.ApiError(400, "Folder name is required");
    const exists = await folder_model_1.Folder.findOne({ name });
    if (exists)
        throw new ApiError_1.ApiError(400, "Folder name already exists");
    await folder_model_1.Folder.create({ name, files: [] });
    const result = await folder_model_1.Folder.find({ name });
    if (!result)
        throw new ApiError_1.ApiError(404, "Folder was not created");
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, result, "Folder created successfully"));
});
exports.createFolder = createFolder;
const editFolder = (0, asyncHandler_1.default)(async (req, res) => {
    const folderId = req.params.id; // Get folder ID from URL params
    if (!folderId)
        throw new ApiError_1.ApiError(400, "Folder ID is required");
    const { name } = req.body;
    if (!name)
        throw new ApiError_1.ApiError(400, "Folder name is required");
    // Update folder
    const result = await folder_model_1.Folder.findByIdAndUpdate(folderId, { name }, { new: true } // Return the updated document
    );
    if (!result)
        throw new ApiError_1.ApiError(404, "Folder not found");
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Folder updated successfully"));
});
exports.editFolder = editFolder;
const deleteFolder = (0, asyncHandler_1.default)(async (req, res) => {
    const folderId = req.params.id; // Get folder ID from URL params
    if (!folderId)
        throw new ApiError_1.ApiError(400, "Folder ID is required");
    const folder = await folder_model_1.Folder.findById(folderId);
    if (!folder)
        throw new ApiError_1.ApiError(404, "Folder not found");
    // Delete all files associated with this folder
    await file_model_1.File.deleteMany({ folder: folder._id });
    // Delete the folder itself
    await folder_model_1.Folder.findByIdAndDelete(folder._id);
    res.status(200).json({
        status: "success",
        message: "Folder deleted successfully",
    });
});
exports.deleteFolder = deleteFolder;

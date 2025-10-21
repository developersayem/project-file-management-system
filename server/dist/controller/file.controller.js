"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.editFile = exports.createFile = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const file_model_1 = require("../models/file.model");
const folder_model_1 = require("../models/folder.model");
// CREATE FILE
const createFile = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, price, numbers, currency, folder } = req.body;
    if (!name)
        throw new ApiError_1.ApiError(400, "File name is required");
    if (!price)
        throw new ApiError_1.ApiError(400, "File price is required");
    if (!folder)
        throw new ApiError_1.ApiError(400, "File folder is required");
    // Check folder existence by ID
    const folderExists = await folder_model_1.Folder.findById(folder);
    if (!folderExists)
        throw new ApiError_1.ApiError(400, "Folder does not exist");
    // Optional: check for duplicate file in same folder
    const exists = await file_model_1.File.findOne({ name, folder });
    if (exists)
        throw new ApiError_1.ApiError(400, "File with this name already exists in the folder");
    // Create file
    const file = await file_model_1.File.create({ name, folder, price, numbers, currency });
    // Add file reference to folder
    await folder_model_1.Folder.findByIdAndUpdate(folder, { $push: { files: file._id } });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, file, "File created successfully"));
});
exports.createFile = createFile;
// EDIT FILE
const editFile = (0, asyncHandler_1.default)(async (req, res) => {
    const fileId = req.params.id;
    const { name, price, numbers, currency } = req.body;
    if (!fileId)
        throw new ApiError_1.ApiError(400, "File ID is required");
    if (!name)
        throw new ApiError_1.ApiError(400, "File name is required");
    const updatedFile = await file_model_1.File.findByIdAndUpdate(fileId, { name, price, numbers, currency }, { new: true });
    if (!updatedFile)
        throw new ApiError_1.ApiError(404, "File not found");
    res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedFile, "File updated successfully"));
});
exports.editFile = editFile;
// DELETE FILE
const deleteFile = (0, asyncHandler_1.default)(async (req, res) => {
    const fileId = req.params.id;
    if (!fileId)
        throw new ApiError_1.ApiError(400, "File ID is required");
    const file = await file_model_1.File.findById(fileId);
    if (!file)
        throw new ApiError_1.ApiError(404, "File not found");
    // Remove file reference from folder
    await folder_model_1.Folder.findByIdAndUpdate(file.folder, { $pull: { files: file._id } });
    // Delete file
    await file_model_1.File.findByIdAndDelete(fileId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, "File deleted successfully"));
});
exports.deleteFile = deleteFile;

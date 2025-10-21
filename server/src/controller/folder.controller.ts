import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";



const getFolders =asyncHandler(async (req: Request, res: Response) => {
  const folders = await Folder.find();
  if(!folders) throw new ApiError(404, "Folders not found");
  res
  .status(200)
  .json(
    new ApiResponse(200, folders, "Folders fetched successfully")
  )
})

const createFolder =asyncHandler(async (req: Request, res: Response) => {
  const {name}=req.body;
  console.log("req.body",req.body)
  console.log("name",name)
  if(!name) throw new ApiError(400, "Folder name is required");

  const exists = await Folder.findOne({name});
  if(exists) throw new ApiError(400, "Folder name already exists");

  await Folder.create({name, files: []});
  const result = await Folder.find({name})
  if(!result) throw new ApiError(404, "Folder was not created");
  res
  .status(201)
  .json(
    new ApiResponse(201, result, "Folder created successfully")
  )
})

const editFolder = asyncHandler(async (req: Request, res: Response) => {
  const folderId = req.params.id; // Get folder ID from URL params
  if (!folderId) throw new ApiError(400, "Folder ID is required");

  const { name } = req.body;
  if (!name) throw new ApiError(400, "Folder name is required");

  // Update folder
  const result = await Folder.findByIdAndUpdate(
    folderId,
    { name },
    { new: true } // Return the updated document
  );

  if (!result) throw new ApiError(404, "Folder not found");

  res.status(200).json(
    new ApiResponse(200, result, "Folder updated successfully")
  );
});

const deleteFolder = asyncHandler(async (req: Request, res: Response) => {
  const folderId = req.params.id; // Get folder ID from URL params
  if (!folderId) throw new ApiError(400, "Folder ID is required");

  const folder = await Folder.findById(folderId);
  if (!folder) throw new ApiError(404, "Folder not found");

  // Delete all files associated with this folder
  await File.deleteMany({ folder: folder._id });

  // Delete the folder itself
  await Folder.findByIdAndDelete(folder._id);

  res.status(200).json({
    status: "success",
    message: "Folder deleted successfully",
  });
});


export{
  getFolders,
  createFolder,
  editFolder,
  deleteFolder
}
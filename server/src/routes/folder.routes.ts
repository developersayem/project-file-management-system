import express from "express";
import {getFolders, createFolder, deleteFolder, editFolder } from "../controller/folder.controller";

const router = express.Router();

// Create a new file
router.get("/", getFolders);
router.post("/", createFolder);
router.patch("/:id", editFolder);
router.delete("/:id", deleteFolder);

export default router;

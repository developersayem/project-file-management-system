import express from "express";
import { createFile, editFile, deleteFile} from "../controller/file.controller";


const router = express.Router();

// Create a new file
router.post("/", createFile);
router.put("/:id", editFile);
router.delete("/:id", deleteFile);

export default router;

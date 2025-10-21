import express from "express";
import { getAllFoldersWithLeads, getFolderWithFiles, getFoldersWithStats, getMarquee, updateMarquee } from "../controller/app.controller";

const router = express.Router();


router.get("/folders-with-leads", getAllFoldersWithLeads);
router.get("/folders-with-subfolders", getFoldersWithStats);

// GET → Fetch latest marquee
router.get("/marquee", getMarquee);

router.get("/:folderId/files", getFolderWithFiles);
// PUT → Update a marquee by ID
router.put("/marquee/:id", updateMarquee);


export default router;

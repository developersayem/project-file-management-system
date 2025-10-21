import express from "express";
import { getAllFoldersWithLeads, getFolderWithFiles, getMarquee, updateMarquee } from "../controller/app.controller";

const router = express.Router();


router.get("/folders-with-leads", getAllFoldersWithLeads);

// GET → Fetch latest marquee
router.get("/marquee", getMarquee);

router.get("/:folderId/files", getFolderWithFiles);
// PUT → Update a marquee by ID
router.put("/marquee/:id", updateMarquee);


export default router;

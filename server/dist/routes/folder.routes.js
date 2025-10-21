"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folder_controller_1 = require("../controller/folder.controller");
const router = express_1.default.Router();
// Create a new file
router.get("/", folder_controller_1.getFolders);
router.post("/", folder_controller_1.createFolder);
router.patch("/:id", folder_controller_1.editFolder);
router.delete("/:id", folder_controller_1.deleteFolder);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("../controller/file.controller");
const router = express_1.default.Router();
// Create a new file
router.post("/", file_controller_1.createFile);
router.put("/:id", file_controller_1.editFile);
router.delete("/:id", file_controller_1.deleteFile);
exports.default = router;

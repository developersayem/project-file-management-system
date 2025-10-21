import express from "express";
import { CreateOrUpdateUnitPrice, getUnitPrice } from "../controller/unit.price.controller";


const router = express.Router();

router.get("/",getUnitPrice)
router.post("/",CreateOrUpdateUnitPrice)


export default router;

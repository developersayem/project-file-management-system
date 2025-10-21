import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { UnitPrice } from "../models/unit.price.model";

// Get unit price
export const getUnitPrice = asyncHandler(async (req: Request, res: Response) => {

const unitprice = await UnitPrice.find();
if(!unitprice) throw new ApiError(404, "unit price not found");

  return res
    .status(200)
    .json(new ApiResponse(200, unitprice, "unit price fetched successfully"));
});


// create unit price or if exits the update
export const CreateOrUpdateUnitPrice = asyncHandler(async (req: Request, res: Response) => {

  const { unitprice } = req.body;

  if (!unitprice) throw new ApiError(400, "unit price is required");

  const exists = await UnitPrice.findOne();
  if (exists) {
    await UnitPrice.findByIdAndUpdate(exists._id, { unitprice });
  } else {
    await UnitPrice.create({ unitprice });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "unit price updated successfully"));
})
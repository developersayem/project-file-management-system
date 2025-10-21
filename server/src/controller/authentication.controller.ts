import { ObjectId } from 'mongoose';
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Authentication, IAuthentication } from "../models/authentication.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// =============================
// Get authentication settings
// =============================
export const getAuthentication = asyncHandler(async (req: Request, res: Response) => {
  let auth = await Authentication.findOne().lean();

  return res.status(200).json(
    new ApiResponse(200, auth, "Authentication settings fetched successfully")
  );
});

// =============================
// Create or update authentication
// =============================
export const upsertAuthentication = asyncHandler(async (req: Request, res: Response) => {
  const { password, isEnabled, isAirplaneModeEnabled } = req.body;

  if (!password && typeof isEnabled === "undefined" && typeof isAirplaneModeEnabled === "undefined") {
    throw new ApiError(400, "At least one field is required to update");
  }

  let auth = await Authentication.findOne();

  if (!auth) {
    // Create new document
    auth = new Authentication({
      password: password || "",
      isEnabled: isEnabled || false,
      isAirplaneModeEnabled: isAirplaneModeEnabled || false,
    });
  } else {
    // Update existing document
    if (password) auth.password = password;
    if (typeof isEnabled !== "undefined") auth.isEnabled = isEnabled;
    if (typeof isAirplaneModeEnabled !== "undefined") auth.isAirplaneModeEnabled = isAirplaneModeEnabled;
  }

  await auth.save();

  return res.status(200).json(
    new ApiResponse(200, auth, "Authentication settings updated successfully")
  );
});

// =============================
// Toggle boolean fields separately
// =============================
export const toggleAuthenticationField = asyncHandler(
  async (req: Request, res: Response) => {
    const { field } = req.params;

    if (!["isEnabled", "isAirplaneModeEnabled"].includes(field)) {
      throw new ApiError(400, "Invalid field to toggle");
    }

    const auth = await Authentication.findOne();
    if (!auth) throw new ApiError(404, "Authentication settings not found");

    // @ts-ignore
    auth[field] = !auth[field];
    await auth.save();

    return res.status(200).json(
      new ApiResponse(200, auth, `${field} toggled successfully`)
    );
  }
);




// =============================
// Check password
// =============================
export const checkPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const auth = await Authentication.findOne();
  if (!auth) {
    throw new ApiError(404, "Authentication settings not found");
  }

  const isMatch = auth.password === password;

  return res.status(200).json(
    new ApiResponse(200, { isMatch }, isMatch ? "Password is correct" : "Password is incorrect")
  );
});
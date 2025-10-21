import { Router } from "express";
import { checkPassword, getAuthentication, toggleAuthenticationField, upsertAuthentication } from "../controller/authentication.controller";


const router = Router();

// GET /api/authentication - fetch current settings
router.get("/", getAuthentication);

// POST /api/authentication - create or update settings
router.post("/", upsertAuthentication);

// POST /api/v1/auth/check-password
router.post("/check-password", checkPassword);

// PATCH /api/authentication/toggle/:field - toggle a boolean field
// :field can be "isEnabled" or "isAirplaneModeEnabled"
router.patch("/toggle/:field", toggleAuthenticationField);

export default router;

import express from "express";

import { authCheck } from "../middlewares/auth-check.js";
import {login, authChecked, forgotPassword, getTokenRefreshed} from "../modules/auth/auth.js";

const router = express.Router();

router.get("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/authCheck", authCheck, authChecked);
router.get("/get-token-refreshed/:id", getTokenRefreshed)

export default router;

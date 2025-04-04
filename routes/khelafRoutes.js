
import express from "express";
import { getBab, getKhelaf } from "../controllers/khelafController.js";

const router = express.Router();

router.get('/getBab/', getBab);

router.get('/getKhelaf/:babID', getKhelaf);

export default router;

// shwahedRoutes.js
import express from "express";
import { getshwahed  } from "../controllers/shwahedController.js";

const router = express.Router();

router.post('/getshwahed', getshwahed);

export default router;

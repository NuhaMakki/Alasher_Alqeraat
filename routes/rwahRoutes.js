// rwahRoutes.js
import express from "express";
import { getRwah , getBook, getRwahByColID } from "../controllers/rwahController.js";

const router = express.Router();

router.get('/getRwah/', getRwah);
router.get('/getBook/', getBook);
router.post('/getRwahByColID', getRwahByColID);

export default router;

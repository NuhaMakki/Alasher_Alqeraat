// ayahRoutes.js
import express from "express";
import { getSorahs, getAyahsBySorahID, getMaqtaBySorahAndAyah, getAyaatBySorahAyahAndMaqta, getKhelafatByAyaatID, getPreviousAyaatByAyaatID, getNextAyaatByAyaatID } from "../controllers/ayahController.js";

const router = express.Router();

router.get('/getSorahs/', getSorahs);

router.get('/getAyahs/:sorahID', getAyahsBySorahID);

router.get('/getMaqta/:sorahID/:ayahID', getMaqtaBySorahAndAyah);

router.get('/getAyaat/:sorahID/:ayahID/:maqta3ID', getAyaatBySorahAyahAndMaqta);

router.get('/getKhelafat/:ayaatID', getKhelafatByAyaatID);

router.get('/getPreviousAyaat/:AyaatID', getPreviousAyaatByAyaatID);

router.get('/getNextAyaat/:AyaatID', getNextAyaatByAyaatID);
export default router;

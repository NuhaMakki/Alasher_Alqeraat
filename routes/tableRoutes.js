// tableRoutes.js
import express from "express";
import { getTableData, getTableNameQuery } from "../controllers/tableController.js";

const router = express.Router();

router.get('/getTableData/:sql', getTableData);

router.post('/getTableNameQuery', getTableNameQuery);

export default router;

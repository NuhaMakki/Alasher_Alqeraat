import express from "express";
import { renderAboutPage, renderMethodsPage, renderManualPage } from "../controllers/pagesController.js";


const router = express.Router();


// Route for 'about' page
router.get('/about', renderAboutPage);

// Route for 'methods' page
router.get('/methods', renderMethodsPage);

// Route for 'manual' page
router.get('/manual', renderManualPage);

export default router;

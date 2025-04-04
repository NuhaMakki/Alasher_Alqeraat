import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


import homeRoutes from "./routes/homeRoutes.js"; // Import home routes
import pagesRoutes from "./routes/pagesRoutes.js"; // Import pages routes
import ayahRoutes from "./routes/ayahRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import khelafRoutes from "./routes/khelafRoutes.js";
import rwahRoutes from "./routes/rwahRoutes.js";
import shwahedRoutes from "./routes/shwahedRoutes.js";

dotenv.config(); // Load environment variables


// Attach libraries to the global object
global.jsPDF = jsPDF;


const app = express();
const port = process.env.PORT || 3010;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Set the view engine to EJS
app.set("view engine", "ejs");

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: "An internal server error occurred. Please try again later." });
});


// Route setup
app.use('/', homeRoutes); // Use home routes for the root path
app.use('/', pagesRoutes); // Use home routes for the root path
app.use('/', ayahRoutes); // Use home routes for the root path
app.use('/', tableRoutes); // Use home routes for the root path
app.use('/', khelafRoutes); // Use home routes for the root path
app.use('/', rwahRoutes); // Use home routes for the root path
app.use('/', shwahedRoutes); // Use home routes for the root path



// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// // Start server
// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${port}`);
// });

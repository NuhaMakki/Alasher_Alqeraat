import { fetchData } from "../config/database.js";

export const renderHomePage = (req, res) => {
    fetchData.getSorah((err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Database error");
        } else {
            res.render('homepage', { sorahs: results});
        }
    });
}
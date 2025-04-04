// shwahedController.js
import { fetchData } from "../config/database.js";

export const getshwahed = (req, res) => {
    const { khelafIDs } = req.body; // Extract khelafIDs from the body

    if (!Array.isArray(khelafIDs)) {
        return res.status(400).send("khelafIDs must be an array");
    }

    fetchData.getshwahed(khelafIDs, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Shwahed Data.");
        }
         //console.log(results);
        res.json(results); // Send the results to the frontend
    });
};
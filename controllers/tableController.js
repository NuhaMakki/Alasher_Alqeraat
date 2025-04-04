// tableController.js
import { fetchData } from "../config/database.js";



export const getTableData = (req, res) => {
    const { sql } = req.params;

    fetchData.getTableData(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Table Data.");
        }
         //console.log(results);
        res.json(results); // Send the previous Ayah data to the frontend
    });
};




export const getTableNameQuery = (req, res) => {
    const { khelafIDs } = req.body; // Extract khelafIDs from the body

    if (!Array.isArray(khelafIDs)) {
        return res.status(400).send("khelafIDs must be an array");
    }

    fetchData.getTableNameQuery(khelafIDs, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Table Name & Query.");
        }
         //console.log(results);
        res.json(results); // Send the results to the frontend
    });
};
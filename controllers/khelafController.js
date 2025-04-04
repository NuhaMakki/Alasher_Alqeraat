// khelafController.js
import { fetchData } from "../config/database.js";



export const getBab = (req, res) => {
    fetchData.getBab((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Bab options.");
        } else {
             //console.log("result: ",results);
            res.json(results); // Return the data as JSON
        }
    });
};

export const getKhelaf = (req, res) => {
    const BabID = req.params.babID;

    fetchData.getKhelaf(BabID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Ayah options.");
        }
         //console.log("result: ",results);
        res.json(results); // Send data to the frontend
    });
};

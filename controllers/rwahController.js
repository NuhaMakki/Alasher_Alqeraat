// ayahController.js
import { fetchData } from "../config/database.js";


export const getRwah = (req, res) => {
    fetchData.getRwah((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Rwah options.");
        } else {
             //console.log("result: ",results);
            res.json(results); // Return the data as JSON
        }
    });
};


export const getBook = (req, res) => {
    fetchData.getBook((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Book options.");
        } else {
             //console.log("result: ",results);
            res.json(results); // Return the data as JSON
        }
    });
};



export const getRwahByColID = (req, res) => {
    const { ColIDs } = req.body; // Extract khelafIDs from the body

    if (!Array.isArray(ColIDs)) {
        return res.status(400).send("ColIDs must be an array");
    }

    fetchData.getRwahByColID(ColIDs, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Rwah Data.");
        }
         //console.log(results);
        res.json(results); // Send the results to the frontend
    });
};
// ayahController.js
import { fetchData } from "../config/database.js";


export const getSorahs = (req, res) => {
    fetchData.getSorah((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Sorah options.");
        } else {
             //console.log("result: ",results);
            res.json(results); // Return the data as JSON
        }
    });
};

export const getAyahsBySorahID = (req, res) => {
    const sorahID = req.params.sorahID;

    fetchData.getAyah(sorahID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Ayah options.");
        }
         //console.log("result: ",results);
        res.json(results); // Send Ayah data to the frontend
    });
};


export const getMaqtaBySorahAndAyah = (req, res) => {
    const { sorahID, ayahID } = req.params;

    fetchData.getMaqta(sorahID, ayahID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Maqta options.");
        }
         //console.log(results);
        res.json(results); // Send Maqta data to the frontend
    });
};



export const getAyaatBySorahAyahAndMaqta = (req, res) => {
    const { sorahID, ayahID, maqta3ID } = req.params;

    fetchData.getAyaatBySorahAyahAndMaqta(sorahID, ayahID, maqta3ID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Ayat options.");
        }
         //console.log(results);
        res.json(results); // Send Ayat data to the frontend
    });
};


export const getKhelafatByAyaatID = (req, res) => {
    const { ayaatID } = req.params;

    fetchData.getKhelafatByAyaatID(ayaatID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching Khelafat options.");
        }
         //console.log(results);
        res.json(results); // Send Khelafat data to the frontend
    });
};


export const getPreviousAyaatByAyaatID = (req, res) => {
    const { AyaatID } = req.params;

    fetchData.getPreviousAyaatByAyaatID(AyaatID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching previous Ayat.");
        }
         //console.log(results);
        res.json(results); // Send the previous Ayah data to the frontend
    });
};


export const getNextAyaatByAyaatID = (req, res) => {
    const { AyaatID } = req.params;

    fetchData.getNextAyaatByAyaatID(AyaatID, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching next Ayat.");
        }
         //console.log(results);
        res.json(results); // Send the next Ayah data to the frontend
    });
};

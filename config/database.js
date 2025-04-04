import mysql from "mysql2";


const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Database host
    database: process.env.DB_NAME,     // Database name
    user: process.env.DB_USER,         // Database user
    password: process.env.DB_PASSWORD, // Database password
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Number of connections in the pool
    queueLimit: 0
});




pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to the database!");
        connection.release(); // Release the connection back to the pool
    }
});


function handleDisconnect() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection:", err);
            setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
        } else {
            //console.log("Database connection re-established");
            if (connection) connection.release();
        }
    });
}

// Listen for connection issues
// pool.on("connection", (connection) => {
//     console.log("New database connection established");
// });

pool.on("error", (err) => {
    console.error("Database connection error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
        console.log("Reconnecting...");
        handleDisconnect();
    }
});

// Handle connection errors globally
pool.on("error", (err) => {
    console.error("MySQL Pool Error:", err);
});

// Initial call to check the connection
handleDisconnect();



// Export the pool for use in queries
//export default pool;


// Reusable queries
const fetchData = {

    getSorah: (callback) => {
        const sql = "SELECT DISTINCT `1-9swar_ayat`.`SorahID`, `1-9swar_ayat`.`SorahName` FROM `1-9swar_ayat` ORDER BY `1-9swar_ayat`.`SorahID` ASC;";
        pool.query(sql, (err, results) => {
            if (err) {
                console.error("Database query error in getSorah:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },


    getAyah: (SorahID, callback) => {
         //console.log(SorahID);
        const sql = "SELECT DISTINCT `1-9swar_ayat`.`AyahID` FROM `1-9swar_ayat` WHERE `1-9swar_ayat`.`SorahID` = ? ORDER BY `1-9swar_ayat`.`AyahID` ASC;";
        pool.query(sql, [SorahID], (err, results) => {
            if (err) {
                console.error("Database query error in getAyah:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    

    getMaqta: (SorahID, AyahID, callback) => {
         //console.log(SorahID, AyahID);
        const sql = "SELECT DISTINCT `1-9swar_ayat`.`Maqta3ID` FROM `1-9swar_ayat` WHERE `1-9swar_ayat`.`SorahID` = ? AND `1-9swar_ayat`.`AyahID` = ?;";
        pool.query(sql, [SorahID, AyahID], (err, results) => {
            if (err) {
                console.error("Database query error in getMaqta:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    

    getAyaatBySorahAyahAndMaqta: (SorahID, AyahID, Maqta3ID, callback) => {
         //console.log(SorahID, AyahID, Maqta3ID);
        const sql = `
            SELECT DISTINCT 
                \`1-9swar_ayat\`.\`AyaatID\`, 
                \`1-9swar_ayat\`.\`Ayah\` 
            FROM 
                \`1-9swar_ayat\` 
            WHERE 
                \`1-9swar_ayat\`.\`SorahID\` = ? 
                AND \`1-9swar_ayat\`.\`AyahID\` = ? 
                AND \`1-9swar_ayat\`.\`Maqta3ID\` = ?;
        `;
        pool.query(sql, [SorahID, AyahID, Maqta3ID], (err, results) => {
            if (err) {
                console.error("Database query error in getAyaatBySorahAyahAndMaqta:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },



    getKhelafatByAyaatID: (AyaatID, callback) => {
         //console.log(AyaatID);
        const sql = `
            SELECT DISTINCT 
                \`1-8ayahkhelafat\`.\`ayahkhelafat_ID\`, 
                \`1-8ayahkhelafat\`.\`khelafID\`, 
                \`1-8ayahkhelafat\`.\`word\`, 
                \`1-2khelafat\`.\`KhelafAName\`, 
                \`1-2khelafat\`.\`KhelafEName\`,
                \`1-1abwab\`.\`BabID\`,
                \`1-1abwab\`.\`BabName\`
            FROM 
                \`1-8ayahkhelafat\`, 
                \`1-2khelafat\`, 
                \`1-1abwab\`, 
                \`1-5babkhelaf\`
            WHERE 
                \`1-8ayahkhelafat\`.\`AyaatID\` = ? 
                AND \`1-8ayahkhelafat\`.\`khelafID\` = \`1-2khelafat\`.\`KhelafID\`
                AND \`1-1abwab\`.\`BabID\` = \`1-5babkhelaf\`.\`BabID\`
                AND \`1-5babkhelaf\`.\`KhelafID\` = \`1-2khelafat\`.\`KhelafID\`
        `;
        pool.query(sql, [AyaatID], (err, results) => {
            if (err) {
                console.error("Database query error in getKhelafatByAyaatID:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },





    getPreviousAyaatByAyaatID: (AyaatID, callback) => {
         //console.log(AyaatID);
        const sql = `
            SELECT 
                \`1-9swar_ayat\`.\`SorahID\`,
                \`1-9swar_ayat\`.\`SorahName\`,
                \`1-9swar_ayat\`.\`AyaatID\`,
                \`1-9swar_ayat\`.\`AyahID\`,
                \`1-9swar_ayat\`.\`Maqta3ID\`,
                \`1-9swar_ayat\`.\`Ayah\`
            FROM 
                \`1-9swar_ayat\`
            WHERE 
                \`1-9swar_ayat\`.\`AyaatID\` = (
                    SELECT MAX(\`AyaatID\`) 
                    FROM \`1-9swar_ayat\` 
                    WHERE \`AyaatID\` < ?
                );
        `;
        pool.query(sql, [AyaatID], (err, results) => {
            if (err) {
                console.error("Database query getPreviousAyaatByAyaatID error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },


    getNextAyaatByAyaatID: (AyaatID, callback) => {
         //console.log(AyaatID);
        const sql = `
            SELECT 
                \`1-9swar_ayat\`.\`SorahID\`,
                \`1-9swar_ayat\`.\`SorahName\`,
                \`1-9swar_ayat\`.\`AyaatID\`,
                \`1-9swar_ayat\`.\`AyahID\`,
                \`1-9swar_ayat\`.\`Maqta3ID\`,
                \`1-9swar_ayat\`.\`Ayah\`
            FROM 
                \`1-9swar_ayat\`
            WHERE 
                \`1-9swar_ayat\`.\`AyaatID\` = (
                    SELECT MIN(\`AyaatID\`) 
                    FROM \`1-9swar_ayat\` 
                    WHERE \`AyaatID\` > ?
                );
        `;
        pool.query(sql, [AyaatID], (err, results) => {
            if (err) {
                console.error("Database query getNextAyaatByAyaatID error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },



    getTableNameQuery: (khelafIDs, callback) => {
         //console.log(khelafIDs);
        const sql = "SELECT DISTINCT `1-3tabels`.`TableName`, `1-3tabels`.`TableQuery` FROM `1-3tabels`, `1-4khelaftable` WHERE `1-3tabels`.`TableID` = `1-4khelaftable`.`TableID` AND `1-4khelaftable`.`KhelafID` in ( ? );";
        pool.query(sql, [khelafIDs], (err, results) => {
            if (err) {
                console.error("Database query getTableNameQuery error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },





    getBab: (callback) => {
        const sql = "SELECT DISTINCT `1-1abwab`.`BabID`, `1-1abwab`.`BabName` FROM `1-1abwab` ,  `1-5babkhelaf`  WHERE `1-1abwab`.`BabID` =  `1-5babkhelaf`.`BabID`  ORDER BY `1-1abwab`.`BabID` ASC";
        pool.query(sql, (err, results) => {
            if (err) {
                console.error("Database query getBab error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },


    getKhelaf: (BabID, callback) => {
         //console.log(BabID);
        const sql = "SELECT DISTINCT `1-2khelafat`.`KhelafID`, `1-2khelafat`.`KhelafAName`, `1-2khelafat`.`KhelafEName` FROM `1-2khelafat`, `1-5babkhelaf` WHERE `1-2khelafat`.`KhelafID` = `1-5babkhelaf`.`KhelafID` AND `1-5babkhelaf`.`BabID` = ? ORDER BY `1-2khelafat`.`KhelafID` ASC;";
        pool.query(sql, [BabID], (err, results) => {
            if (err) {
                console.error("Database query getKhelaf error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },






    getTableData: (sql, callback) => {
        //console.log(sql);
        pool.query(sql, (err, results) => {
            if (err) {
                console.error("Database query getTableData error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    

    //--------------------------------------
    getRwah: (callback) => {
        const sql = "SELECT DISTINCT QarieID, QarieName, RawyID, RawyName, Tareeq1ID, Tareeq1Name, Tareeq2ID, Tareeq2Name, BookID, BookName FROM `0-9toroq` ORDER BY QarieID, RawyID, Tareeq1ID, Tareeq2ID, BookID;" ;
        pool.query(sql, (err, results) => {
            if (err) {
                console.error("Database query error in getRwah:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },


    getRwahByColID: (ColIDs, callback) => {
         //console.log(ColIDs);
        const sql = "SELECT DISTINCT QarieID, QarieName, RawyID, RawyName, Tareeq1ID, Tareeq1Name, Tareeq2ID, Tareeq2Name, BookID, BookName FROM `0-9toroq` WHERE `0-9toroq`.`ColID` in ( ? ) ORDER BY QarieID, RawyID, Tareeq1ID, Tareeq2ID, BookID;";
        pool.query(sql, [ColIDs], (err, results) => {
            if (err) {
                console.error("Database query error in getRwahByColID:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },

    //--------------------------------------
    getBook: (callback) => {
        const sql = "SELECT DISTINCT `0-7book`.`BookID`, `BookName` FROM `0-7book`, `0-1treeq` WHERE `0-1treeq`.`BookID` = `0-7book`.`BookID` ORDER BY `BookID`";
        pool.query(sql, (err, results) => {
            if (err) {
                console.error("Database query error in getBook:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },
    


    //--------------------------------------

    getshwahed: (khelafIDs, callback) => {
         //console.log(khelafIDs);
        const sql = "SELECT DISTINCT `1-11khelafatshwahed`.`KhelafID` , `1-10shwahed`.`ShahedID` , `1-10shwahed`.`NathmID`, `1-10shwahed`.`ShahedText` FROM `1-10shwahed`, `1-11khelafatshwahed` WHERE `1-11khelafatshwahed`.`KhelafID` in (?) AND `1-10shwahed`.`ShahedID` = `1-11khelafatshwahed`.`ShahedID` ORDER BY `1-11khelafatshwahed`.`KhelafID`;";
        pool.query(sql, [khelafIDs], (err, results) => {
            if (err) {
                console.error("Database query error in getShwahed:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    
    },

};

export { pool, fetchData };

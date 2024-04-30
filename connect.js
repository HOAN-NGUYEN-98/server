const express = require("express");
const sql = require("mssql");
const fs = require('fs');
const app = express();
// SQL Server configuration
var config = {
    "user": "sa", // Database username
    "password": "123456", // Database password
    "server": "localhost", // Server IP address
    "database": "DB_USER", // Database name
    "options": {
        "encrypt": false // Disable encryption
    }
}
 
// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});
 
// Define route for fetching data from SQL Server
app.get("/", (request, response) => {
    // Execute a SELECT query
    new sql.Request().query("SELECT * FROM [DB_USER].[dbo].[USER]", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            response.send(result.recordset); // Send query result as response
           // console.dir(result.recordset);
            console.log(result.recordset);
 
            const data = JSON.stringify(result.recordset);
 
            // write file to disk
            fs.writeFile('./db.json', data, 'utf8', (err) => {
           
                if (err) {
                    console.log(`Error writing file: ${err}`);
                } else {
                    console.log(`File is written successfully!`);
                }
           
            });
 
        }
    });
});
 
// Start the server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000...");
    require('child_process').exec('start http://localhost:3000/');
});
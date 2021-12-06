const mysql = require("mysql");

const database = mysql.createConnection({
    user:"root",
    host: "localhost",
    password:"password",
    database:"chat_application",
    port:"3306"
});

database.connect((error)=>{
    if(error) return console.error("errr", error.message);
    console.log(`Database is connected`)
})

module.exports = database;
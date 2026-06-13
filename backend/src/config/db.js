const mongoose = require("mongoose");

async function ConnectToDB() {
    await mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to DB successful ly!");
        })
        .catch(error => {
            console.error("DB Error:", error);
            process.exit(1);
        });
}

module.exports = ConnectToDB;
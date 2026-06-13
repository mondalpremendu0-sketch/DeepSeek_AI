require('dotenv').config();
const { createServer } = require("http");
const app = require('./src/app.js');
const connectToDB = require('./src/config/db.js');


const httpServer = createServer(app);


httpServer.listen(3000,async () => {
  await connectToDB();
  console.log("Server is running on port 3000!");
})
require('dotenv').config();
const app = require('./src/app.js');
const connectToDB = require('./src/config/db.js');






app.listen(3000,async () => {
  await connectToDB();
  console.log("Server is running on port 3000!");
})
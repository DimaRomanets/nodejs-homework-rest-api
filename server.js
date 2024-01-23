const mongoose = require("mongoose");

const app = require("./app");

const { DB_URL, PORT } = process.env;
mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");

/***************************************/
// Express App
const app = express();
/***************************************/

// Constants
const PORT = process.env.PORT;

/*************************************************************/
// Express JSON, to get the request body
app.use(express.json());

// Middleware. code executed between the request and response
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

/*************************************************************/

/*************************************************************/
/** DB Connection */
console.log("====> Connecting to Mongo DB.");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("====> Connected to Mongo DB.");
    // Listen for requests
    app.listen(PORT, () => {
      console.log(`API APP is listening on port ${PORT}.`);
    });
  })
  .catch((error) => console.log(error));

/*************************************************************/

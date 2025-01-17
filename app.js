// ℹ️ Connects to the database
require("./db")();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
app.use(express.static(__dirname + '/public'))

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js

app.use("/api", require("./routes/index.routes"));
app.use('/characters', require('./routes/characters.route'))

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

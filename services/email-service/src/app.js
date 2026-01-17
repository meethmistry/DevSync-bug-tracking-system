const express = require("express");
const errorHandler = require('../../../shared/middlewares/error.middleware');
const routes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use("/auth", routes);
app.use(errorHandler);

module.exports = app;
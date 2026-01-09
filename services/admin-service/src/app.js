const express = require("express");
const authRoute = require('./routes/routes');
const errorHandler = require('../../../shared/middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use('/auth', authRoute);
app.use(errorHandler);

module.exports = app;
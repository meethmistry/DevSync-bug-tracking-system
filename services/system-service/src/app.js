const express = require("express");
const projectRoutes = require("../src/routes/project.routes");
const bugRoutes = require("../src/routes/bug.routes");
const accessRoutes = require("../src/routes/access.routes");
const errorHandler = require('../../../shared/middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use('/project', projectRoutes);
app.use('/bug', bugRoutes);
app.use('/access', accessRoutes);
app.use(errorHandler);

module.exports = app;
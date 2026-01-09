const express = require('express');
const cors = require('cors');
const { createServiceProxy } = require('./middlewares/proxy.middleware');

const app = express();

app.use(cors());

app.use(
  '/admin',
  createServiceProxy('Admin', process.env.ADMIN_AUTH_SERVICE_URL)
);

app.use(
  '/system',
  createServiceProxy('System', process.env.ADMIN_SYSTEM_SERVICE_URL)
);

module.exports = app;
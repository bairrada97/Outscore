const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

 //TODO:add to config? files
 app.use(`/.netlify/functions/api`, router);
 app.set('view engine', 'html');

 module.exports = {app, router, serverless};
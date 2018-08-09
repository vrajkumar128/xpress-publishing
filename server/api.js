const express = require('express');

// Create apiRouter
const apiRouter = express.Router();

// Import and mount artistsRouter
const artistsRouter = require('./artists');
apiRouter.use('/artists', artistsRouter);

module.exports = apiRouter;
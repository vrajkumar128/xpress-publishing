const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create seriesRouter
const seriesRouter = express.Router();

// Handle :seriesId URL parameter
seriesRouter.param('seriesId', async (req, res, next, id) => {
  try {
    const series = await getFromDatabaseById('series', id);

    if (series) {
      req.series = series;
      next();
    } else {
      res.status(404).send("Series not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received series is valid
const validateSeries = (req, res, next) => {
  const { series } = req.body;

  if (series && series.name && series.description) {
    next();
  } else {
    res.status(400).send("Submitted series contains missing field(s)");
  }
};

// Get all series
seriesRouter.get('/', async (req, res, next) => {
  try {
    const series = await getAllFromDatabase('series');
    res.send({ series });
  } catch (err) {
    next(err);
  }
});

// Get an individual series
seriesRouter.get('/:seriesId', (req, res) => {
  const series = req.series;
  res.send({ series });
});

// Create a new series
seriesRouter.post('/', validateSeries, async (req, res, next) => {
  try {
    const series = await addToDatabase('series', req.body.series);
    res.status(201).send({ series });
  } catch (err) {
    next(err);
  }
});

// Update a series
seriesRouter.put('/:seriesId', validateSeries, async (req, res, next) => {
  try {
    const series = await updateInstanceInDatabase('series', req.body.series, req.series.id);
    res.send({ series });
  } catch (err) {
    next(err);
  }
});

// Delete a series
seriesRouter.delete('/:seriesId', async (req, res, next) => {
  try {
    const numIssues = await deleteFromDatabaseById('series', req.series.id);
    numIssues > 0
      ? res.status(400).send("Error: Series has related issue(s)")
      : res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// Import and mount issuesRouter
const issuesRouter = require('./issues');
seriesRouter.use('/issues', issuesRouter);

module.exports = seriesRouter;
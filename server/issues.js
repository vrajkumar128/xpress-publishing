const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create issuesRouter
const issuesRouter = express.Router();

// Handle :issueId URL parameter
issuesRouter.param('issueId', async (req, res, next, id) => {
  try {
    const issue = await getFromDatabaseById('issue', id);

    if (issue) {
      req.issue = issue;
      next();
    } else {
      res.status(404).send("Issue not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received issue is valid
const validateIssue = (req, res, next) => {
  const { issue } = req.body;

  if (issue && issue.name && issue.issueNumber
    && issue.publicationDate && issue.artistId) {
    issue.seriesId = req.series.id;
    next();
  } else {
    res.status(400).send("Submitted issue contains missing field(s)");
  }
};

// Get all issues
issuesRouter.get('/', async (req, res, next) => {
  try {
    const issues = await getAllFromDatabase('issue', req.series.id);
    res.send({ issues });
  } catch (err) {
    next(err);
  }
});

// Create a new issue
issuesRouter.post('/', validateIssue, async (req, res, next) => {
  try {
    const issue = await addToDatabase('issue', req.body.issue);
    res.status(201).send({ issue });
  } catch (err) {
    next(err);
  }
});

// Update an issue
issuesRouter.put('/:issueId', validateIssue, async (req, res, next) => {
  try {
    const issue = await updateInstanceInDatabase('issue', req.body.issue, req.issue.id);
    res.send({ issue });
  } catch (err) {
    next(err);
  }
});

// Delete an issue
issuesRouter.delete('/:issueId', async (req, res, next) => {
  try {
    await deleteFromDatabaseById('issue', req.issue.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = issuesRouter;
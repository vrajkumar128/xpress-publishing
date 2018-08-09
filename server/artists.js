const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create artistsRouter
const artistsRouter = express.Router();

// Handle :artistId router parameter
artistsRouter.param('artistId', async (req, res, next, id) => {
  try {
    const artist = await getFromDatabaseById('artist', id);

    if (artist) {
      req.artist = artist;
      next();
    } else {
      res.status(404).send("Artist not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received artist is valid
const validateArtist = (req, res, next) => {
  const { artist } = req.body;

  if (artist && artist.name && artist.dateOfBirth
    && artist.biography) {
    next();
  } else {
    res.status(400).send("Submitted artist contains missing field(s)");
  }
};

// Get all artists
artistsRouter.get('/', async (req, res, next) => {
  try {
    const artists = await getAllFromDatabase('artist');
    res.send({ artists });
  } catch (err) {
    next(err);
  }
});

// Get a single artist
artistsRouter.get('/:artistId', async (req, res) => {
  const artist = req.artist;
  res.send({ artist });
});

// Create a new artist
artistsRouter.post('/', validateArtist, async (req, res, next) => {
  try {
    const artist = await addToDatabase('artist', req.body.artist);
    res.status(201).send({ artist });
  } catch (err) {
    next(err);
  }
});

// Update an artist
artistsRouter.put('/:artistId', validateArtist, async (req, res, next) => {
  try {
    const artist = await updateInstanceInDatabase('artist', req.body.artist, req.artist.id);
    res.send({ artist });
  } catch (err) {
    next(err);
  }
});

// Delete an artist
artistsRouter.delete('/:artistId', async (req, res, next) => {
  try {
    const artist = await deleteFromDatabaseById('artist', req.artist.id);
    res.send({ artist });
  } catch (err) {
    next(err);
  }
});

module.exports = artistsRouter;

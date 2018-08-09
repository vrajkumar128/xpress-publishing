const express = require('express');
const app = express();

// Set port that server listens on
const PORT = process.env.PORT || 4000;

// Import and use JSON body parsing middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import and use logging middleware
const morgan = require('morgan');
app.use(morgan('tiny'));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;
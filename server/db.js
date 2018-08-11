const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const { toSnakeCase } = require('../src/utils/helpers');

// Get all rows from the given table
const getAllFromDatabase = (table) => (
  new Promise((res, rej) => {
    if (table === 'artist') {
      return db.all(`SELECT * FROM Artist WHERE is_currently_employed=1;`, (err, rows) => {
        err ? rej(err) : res(rows);
      });
    }

    db.all(`SELECT * FROM ${table};`, (err, rows) => {
      err ? rej(err) : res(rows);
    });
  })
);

// Get the row with the given ID from the given table
const getFromDatabaseById = (table, id) => (
  new Promise((res, rej) => {
    db.get(`SELECT * FROM ${table} WHERE id=${id};`, (err, row) => {
      err ? rej(err) : res(row);
    });
  })
);

// Add the given data to the given table
const addToDatabase = (table, data) => {
  const columns = Object.keys(data).map(key => toSnakeCase(key)); 
  const stringifiedValues = Object.values(data).map(val => `"${val}"`);

  return new Promise((res, rej) => {
    db.run(`INSERT INTO ${table} (${columns}) VALUES (${stringifiedValues});`, function(err) {
      if (err) {
        return rej(err);
      }

      db.get(`SELECT * FROM ${table} WHERE id=${this.lastID};`, (err, row) => {
        err ? rej(err) : res(row);
      });
    });
  });
};

// Update the row with the given ID in the given table with the given data
const updateInstanceInDatabase = (table, data, id) => {
  const pairs = Object.keys(data).map(key => 
    `${toSnakeCase(key)} = "${data[key]}"`);

  return new Promise((res, rej) => {
    db.run(`UPDATE ${table} SET ${pairs} WHERE id=${id};`, (err) => {
      if (err) {
        return rej(err);
      }

      db.get(`SELECT * FROM ${table} WHERE id=${id};`, (err, row) => {
        err ? rej(err) : res(row);
      });
    });
  });
};

// Delete the row with the given ID from the given table
const deleteFromDatabaseById = (table, id) => (
  new Promise((res, rej) => {
    if (table === 'artist') {
      db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE id=${id};`, (err) => { // Set an artist to unemployed
        if (err) {
          return rej(err);
        }

        db.get(`SELECT * FROM Artist WHERE id=${id};`, (err, row) => {
          err ? rej(err) : res(row);
        });
      });
    }
    
    if (table === 'series') {
      db.get(`SELECT COUNT(*) AS 'count' FROM Issue WHERE series_id=${id};`, (err, row) => { // Check if series has any related issues
        if (err) {
          rej(err);
        } else if (row.count > 0) {
          res(row.count);
        } else {
          db.run(`DELETE FROM Series WHERE id=${id};`, (err) => {
            err ? rej(err) : res();
          });
        }
      });
    }
  })
);

module.exports = { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
};

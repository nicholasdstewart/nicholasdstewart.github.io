// ***************************************** //
// Required libraries for the server to work //
// ***************************************** //

import express from 'express';
import fetch from 'node-fetch';
// const sqlite3 = require('sqlite3').verbose(); // We're including a server-side version of SQLite, the in-memory SQL server.
// const open = sqlite3.open; // We're including a server-side version of SQLite, the in-memory SQL server.
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import writeUser from './libraries/writeuser';

// Defining initial settings for the in-memory SQL database
const dbSettings = {
  filename: './tmp/database.db', // defines the location of the database
  driver: sqlite3.Database // defines the computer program that implements a protocol for a database connection
}; 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ************************************ //
// NOTE: this function is from old code //
// ************************************ //
function processDataForFrontEnd(req, res) {
  const baseURL = ''; // Enter the URL for the data you would like to retrieve here

  // Your Fetch API call starts here
  // Note that at no point do you "return" anything from this function -
  // it instead handles returning data to your front end at line 34.
    fetch(baseURL)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        res.send({ data: data }); // here's where we return data to the front end
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/error');
      });
}

// ********************************* //
// Setting up the API for the server //
// ********************************* //
app.route('/api')

  // GET REQUEST HANDLING BELOW: //
  .get((req, res) => {
    (async()=> {
      const db = await open(dbSettings)
      const result = await db.all('SELECT * FROM user', (err) => {
        console.log('writeuser', err)
      });
      //console.log('Expected result', result);
      res.json(result);
    })()
  })
  // POST REQUEST HANDLING BELOW: //
  .post((req, res) => {
    console.log("/api post request", req.body);
    if(!req.body.name){ // if the 'name' section of the form is not filled out...
      console.log(req.body);
      res.status('204').send('The NAME section was not filled out.')
    } else {
      writeUser(req.body.name, dbSettings) // calls an external function (writeuser.js)
      .then((result) => {
        //console.log('Here is the result', result);
        res.json(result);
        //res.send('your post request was successful'); // sends this back to the front-end
      })
    }
  })
  // PUT REQUEST HANDLING BELOW: //
  .put((req, res) => {
    console.log("/api put request", req.body);
    if(!req.body.name){
      console.log(req.body);
      res.status('204').send('The NAME section was not filled out.')
    } else {
      writeUser(req.body.name, dbSettings) // calls an external function (writeuser.js)
      .then((result) => {
        //console.log('Here is the result', result);
        res.json({"success":true,"message":"Your PUT request was successful!"});
      })
    }
  })

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`)
});


// These are our required libraries to make the server work.

import express from 'express';
import fetch from 'node-fetch';
// const sqlite3 = require('sqlite3').verbose(); // We're including a server-side version of SQLite, the in-memory SQL server.
// const open = sqlite3.open; // We're including a server-side version of SQLite, the in-memory SQL server.
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import writeUser from './libraries/writeuser';


const dbSettings = {
  filename: './tmp/database.db',
  driver: sqlite3.Database
}; 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

/*
async function writeUser(username, settings) {
  const db = await open(settings);
  await db.exec("CREATE TABLE IF NOT EXISTS user (name)");
  await db.exec('INSERT INTO user VALUES ("${username}")');
  const result = await db.each('SELECT * FROM user');
  console.log("Expected result", result);
  return result;
}
*/


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

// Syntax change - we don't want to repeat ourselves,
// or we'll end up with spelling errors in our endpoints.
// 
app.route('/api')
  .get((req, res) => {
    //processDataForFrontEnd(req, res)
    (async()=> {
      const db = await open(dbSettings)
      const result = await db.each('SELECT * FROM user');
      console.log('Expected result', result);
      res.json(result);
    })()
  })
  .post((req, res) => {
    console.log("/api post request", req.body);
    if(!req.body.name){ // if the 'name' section of the form is not filled out
      console.log(req.body);
      res.status('418').send('something went wrong, additionally i am a teapot')
    } else {
      writeUser(req.body.name, dbSettings)
      .then((result) => {
        console.log('Here is the result', result);
        res.json(result);
        //res.send('your post request was successful'); // sends this back to the front-end
      })
    }
  })
  .put((req, res) => {
    console.log("/api put request", req.body);
    if(!req.body.name){
      console.log(req.body);
      res.status('418').send('something went wrong, additionally i am a teapot')
    } else {
      writeUser(req.body.name, dbSettings)
      .then((result) => {
        console.log('Here is the result', result);
        res.json({"success":true,"message":"success!"});
      })
      //res.send('your put request was successful') // sends this back to the front-end
    }
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});


// These are our required libraries to make the server work.
// We're including a server-side version of Fetch to build on your client-side work
const express = require('express'); // 'express' is a library
const fetch = require('node-fetch'); // 'node-fetch' is a library

// Here we instantiate the server we're going to turn on
const app = express();


// Servers are often subject to the whims of their environment.
// Here, if our server has a PORT defined in its environment, it will use that.
// Otherwise, it will default to port 3000
const port = process.env.PORT || 3000;

// Our server needs certain features - like the ability to send and read JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// And the ability to serve some files publicly, like our HTML.
app.use(express.static('public'));



function processDataForFrontEnd(req, res) {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'; // Enter the URL for the data you would like to retrieve here

  // Your Fetch API call starts here
  // Note that at no point do you "return" anything from this function -
  // it instead handles returning data to your front end at line 34.
    fetch(baseURL)
      .then((results) => results.json())
      .then((data) => {

        // Declaring some initial objects
        const organized_establishments = [];

        // The following lines create a set of establishment categories
        let category_set = new Set();
        for(i = 0; i < data.length; i++){
          //console.log(data[i]["category"]);
          category_set.add(data[i]["category"]);
        }

        let category_array = Array.from(category_set);
        let sum = 0;

        for(i = 0; i < category_array.length; i++){
          //inner_cat_obj = {label: "", "establishments": [], y: ""};
          inner_cat_obj = {y:"", "establishments": [], label:""}
          inner_cat_obj.label = category_array[i];
          for(j = 0; j < data.length; j++){
            if(data[j]["category"] == category_array[i]){
              inner_cat_obj["establishments"].push(data[j]["name"]);
            }
          }
          inner_cat_obj.y = inner_cat_obj["establishments"].length;
          delete inner_cat_obj.establishments;
          organized_establishments.push(inner_cat_obj);
        }

        data = organized_establishments;

        // Listing all of the data on the server side:
        console.log(data);

        res.send({ data: data }); // here's where we return data to the front end
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/error');
      });
}

// This is our first route on our server.
// To access it, we can use a "GET" request on the front end
// by typing in: localhost:3000/api or 127.0.0.1:3000/api

//app.get('127.0.0.1:3000/api', (req, res) => {processDataForFrontEnd(req, res)});
app.get('/api', (req, res) => {processDataForFrontEnd(req, res)});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

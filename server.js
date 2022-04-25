require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({extended: false}));

let urls = [];

//POST
app.post("/api/shorturl/new", function(req, res) {
  
  const getHostnameFromRegex = (url) => {
  // run against regex
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // extract hostname (will be null if no match is found)
  return matches && matches[1];
  }

  hostname = getHostnameFromRegex(req.body.url);
  console.log("Hostname: " + hostname);

  // if no hostname found, return here
  if (!hostname) res.json({ error: 'invalid url' });

  // check if url is valid
  dns.lookup(hostname, (error, addresses) => {
    console.error(error);
    console.log(addresses);

    if (!error) {
       let newUrl = { original_url : req.body.url, short_url : urls.length + 1};
      urls.push(newUrl);
      res.json(newUrl);
    } else {
      res.json({ error: 'invalid url' });
    }

  });

});

//GET
app.get('/api/shorturl/:num', function(req, res) {

  for (let i = 0; i < urls.length; i++) {
    console.log(urls[i].original_url);
    if (urls[i].short_url == req.params.num) {
        res.redirect(urls[i].original_url);
    }
  }

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

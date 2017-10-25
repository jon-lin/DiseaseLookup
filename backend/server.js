const express = require('express');
const path    = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const router = express.Router();
// const db = require('./database.js');

// let config = process.env.keys ? JSON.parse(process.env.keys) : JSON.parse(require('./config.js'));

const app = express();

app.use(bodyParser.json());

// app.get(`/api/trialdescription/:nct_id`, db.getTrialDescription);

app.get('/', function (req, res) {
  // res.sendFile(path.join(__dirname + '/../index.html'));
  request.get({
    url: `https://clinicaltrials.gov/ct2/results/download_fields?cond=cardiovascular+diseases&down_count=100&down_fmt=xml&down_flds=all&sfpd_s=01%2F01%2F2015&sfpd_e=12%2F31%2F2016&down_chunk=1`
  },
    function (error, response, body) {
      if (error) {
        res.status(422).send('Failed to connect');
      } else {
        res.send(body);
      }
    }
  );
});

// app.get('/bundle.js', function (req, res) {
//   res.sendFile(path.join(__dirname + '/javascripts/bundle.js'));
// });
//
// app.get('/style.css', function (req, res) {
//   res.sendFile(path.join(__dirname + '/styles/styles.css'));
// });

// app.get('/loading.svg', function (req, res) {
//   res.sendFile(path.join(__dirname + '/assets/loading.svg'));
// });

// app.get('/favicon.ico', function (req, res) {
//   res.sendFile(path.join(__dirname + '/assets/favicon.ico'));
// });

const port = process.env.PORT || 8080
app.listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});

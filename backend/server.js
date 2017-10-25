const express = require('express');
const path    = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const router = express.Router();
const db = require('./database.js');

let config = process.env.keys ? JSON.parse(process.env.keys) : JSON.parse(require('./config.js'));

const app = express();

app.use(bodyParser.json());

app.get(`/api/tweets/:id/sentiments`, db.getTweetByID);

app.post(`/api/tweets`, db.storeTweet);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/bundle.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/javascripts/bundle.js'));
});

app.get('/style.css', function (req, res) {
  res.sendFile(path.join(__dirname + '/styles/styles.css'));
});

app.get('/jquery.popuptooltip.css', function (req, res) {
  res.sendFile(path.join(__dirname + '/javascripts/jquery.popuptooltip.css'));
});

app.get('/jquery.popuptooltip.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/javascripts/jquery.popuptooltip.js'));
});

app.get('/loading.svg', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/loading.svg'));
});

app.get('/tweettones.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/tweettones.png'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/favicon.ico'));
});

app.get('/sentiments', function (req, res) {
  let inputText = req.query.inputText;

  request.get({
      url: "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone",
      auth: {
        user: config.watsonUsername,
        password: config.watsonPassword
      },
      qs: {
        text: inputText,
        version:'2016-05-19',
        tones: 'emotion, language, social'
      },
      json: true
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

const port = process.env.PORT || 8080
app.listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});

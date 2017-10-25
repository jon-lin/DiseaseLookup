const express = require('express');
const path    = require('path');
const request = require('request');
const bodyParser = require('body-parser');
// const X2JSLib = require('x2js');
var parseString = require('xml2js').parseString;

var expressLogging = require('express-logging');
var logger = require('logops');

var app = express();
app.use(expressLogging(logger));

const router = express.Router();
const db = require('./database.js');

// let config = process.env.keys ? JSON.parse(process.env.keys) : JSON.parse(require('./config.js'));

app.use(bodyParser.json());

app.get(`/trialdescription/:nct_id`, db.getTrialDescription);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/pubmed/hits', function (req, res) {
  let diseaseName = req.query.diseaseName;
  let startingIdx = req.query.startingIdx;

  request.get({
    url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`,
    qs: {
          db: "pubmed",
          term: "cardiovascular disease" + '[majr]' + "Journal Article[ptyp]",
          datetype: "pdat",
          mindate: "2015/01/01",
          maxdate: "2016/12/31",
          usehistory: "y",
          sort: "pub date"
        }
    },
      function (error, response, body) {
        if (error) {
          res.status(422).send('Failed to connect');
        } else {
          let queryKey = body.match(/<QueryKey>(.*?)<\/QueryKey>/)[1];
          let WebEnv = body.match(/<WebEnv>(.*?)<\/WebEnv>/)[1];
          let count = body.match(/<Count>(.*?)<\/Count>/)[1];
          res.json({queryKey, WebEnv, count});
        }
    });
});

app.get('/pubmed/articles', function (req, res) {
  request.get({
    url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`,
    qs: {
          db: "pubmed",
          query_key: req.query.queryKey,
          WebEnv: req.query.WebEnv,
          retmode: "xml",
          retmax: "5",
          retstart: req.query.retstart,
        }
    },
      function (error, response, body) {
        if (error) {
          res.status(422).send('Failed to connect');
        } else {
          parseString(body, function (err, result) {
              res.json(result);
          });
        }
    });
});

app.get('/clinicaltrials', function (req, res) {
  let diseaseName = req.query.diseaseName;
  let chunk = req.query.chunk;
  let onlyGetHits = req.query.onlyGetHits;

  request.get({
    url: `https://clinicaltrials.gov/ct2/results/download_fields`,
    qs: {
      cond: diseaseName || "cardiovascular diseases",
      down_count: "100",
      down_fmt: "xml",
      down_flds: "all",
      sfpd_s: "01/01/2015",
      sfpd_e: "12/31/2016",
      down_chunk: chunk || "1"
    }
  },
    function (error, response, body) {
      if (error) {
        res.status(422).send('Failed to connect');
      } else {
        parseString(body, function (err, result) {
            res.send(formatData(result, onlyGetHits));
        });
      }
    }
  );
});

function formatData(data, onlyGetHits) {
  let result = [{
    hits: Number(data.search_results["$"].count)
  }];

  if (onlyGetHits) return result;

  data.search_results.study.forEach(study => {
    console.log(study.title[0]);
    result.push({
      nct_id: study.nct_id[0],
      title: study.title[0],
      recruitment: study.recruitment[0]["_"],
      locations: study.locations,
      dates: {
        first_received: study.first_received[0],
        start_date: study.start_date[0],
        completion_date: study.completion_date ? study.completion_date[0] : "None listed"
      }
    });
  });

  return result;
}

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

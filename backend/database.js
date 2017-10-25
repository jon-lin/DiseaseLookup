var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

var cn = {
  host: 'aact-prod.cr4nrslb1lw7.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'aact',
  user: 'aact',
  password: 'aact'
};

var db = pgp(cn);

function getTrialDescription(req, res, next) {
  let nct_id = req.params.nct_id;
  db.one('select * from detailed_descriptions where nct_id = $1', nct_id)
    .then(data => res.json(data))
    .catch(err => res.json({error: 'No result found'}));
}

module.exports = {getTrialDescription};

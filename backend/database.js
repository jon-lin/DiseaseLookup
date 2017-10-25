var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var prod_database = process.env.DATABASE_URL;
var connectionString = prod_database ? prod_database : 'postgres://localhost:5432/tweettones';
var db = pgp(connectionString);

function getTweetByID(req, res, next) {
  let tweetId = req.params.id;
  db.one('select * from tweettones where id = $1', tweetId)
    .then(data => res.json(data))
    .catch(err => res.json({error: 'No result found'}));
}

function storeTweet(req, res, next) {
  db.none('insert into tweettones(id, twitterHandle, timestamp, body, emotion_tone, language_tone, social_tone)' +
      'values(${id}, ${twitterHandle}, ${timestamp}, ${body}, ${emotion_tone}, ${language_tone}, ${social_tone})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one tweet'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {getTweetByID, storeTweet};

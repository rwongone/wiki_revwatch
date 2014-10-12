var config = {}
config.twitter = {};

config.twitter.CONSUMER_KEY = process.env.CONS_KEY;
config.twitter.CONSUMER_SECRET=  process.env.CONS_SEC;
config.twitter.ACCESS_TOKEN = process.env.ACC_TOK;
config.twitter.ACCESS_SECRET=  process.env.ACC_SEC;

module.exports = config;
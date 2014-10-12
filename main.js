var config = require('./config');
var wikibot = require('nodemw');
var moment = require('moment');
var Twit = require('twit');

var T = new Twit({
    consumer_key:         config.twitter.CONSUMER_KEY
  , consumer_secret:      config.twitter.CONSUMER_SECRET
  , access_token:         config.twitter.ACCESS_TOKEN
  , access_token_secret:  config.twitter.ACCESS_SECRET
});

var wiki_client = new wikibot({
	server: 'en.wikipedia.org',
	path: '/w',
	debug: true,
});

function oneDayAgo() {
	return moment().subtract(1, 'day').format('YYYYMMDDhhmmss');
}

function now() {
	return moment().format('YYYYMMDDhhmmss');
}

function getRecentChange(i, max, maxRev, maxTitle, changeResponse) {
	if (i < max) {
		if (changeResponse[i] && changeResponse[i].type == 'edit') {
			var title = changeResponse[i].title;

			var revParams = {
				action: 'query',
				titles: title,
				prop: 'revisions',
				rvprop: 'user|flags',
				rvlimit: 'max',
				rvstart: now(),
				rvend: oneDayAgo(),
				format: 'json'
			};

			wiki_client.api.call(revParams, function(revResponse) {
				var pageId = Object.keys(revResponse.pages)[0];		
				var revObj = revResponse.pages[pageId].revisions;
				if (revObj) {
					if (revObj.length > maxRev) {
						maxRev = revObj.length;
						maxTitle = this.title;
					}
				}
				getRecentChange(i + 1, max, maxRev, maxTitle, changeResponse);
			}.bind( {title: title}));
		} else {
			getRecentChange(i + 1, max, maxRev, maxTitle, changeResponse);
		}
	} else {
		T.post('statuses/update', { status: maxTitle + " has been revised " + maxRev + " times in the past day." }, function(err, data, response) {
		  console.log(data);
		});
	}
}

function mainLoop() {
	var now = new Date();
	var deltaT = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
	if (deltaT < 0) {
	     deltaT += 86400000;
	}
	console.log(deltaT);
	setTimeout(function(){
		wiki_client.getRecentChanges(oneDayAgo(), function(changeResponse) {
			getRecentChange(0, 100, 0, "n/a", changeResponse);
		});
		mainLoop();
	}, deltaT);
}

mainLoop();
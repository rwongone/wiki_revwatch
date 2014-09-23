var wikibot = require('nodemw');
var moment = require('moment');

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



wiki_client.getRecentChanges(oneDayAgo(), function(changeResponse) {
	for (var i = 0; i < 10; i++) {
		if (!changeResponse[i]) {
			break;
		} else if (changeResponse[i].type == 'edit') {
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
				if (revResponse.pages[pageId].revisions) {
					console.log(this.title);
					console.log(revResponse.pages[pageId].revisions.length);
				}
			}.bind( {title: title}));
		}
	}
});
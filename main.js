var wikibot = require('nodemw');
var moment = require('moment');

var wiki_client = new wikibot({
	server: 'en.wikipedia.org',
	path: '/w',
	debug: true,
});

function timeWeekAgo() {
	return moment().subtract(7, 'days').format('YYYYMMDDhhmmss');
}

wiki_client.getRecentChanges(timeWeekAgo, function(data) {
	for (var i = 0; i < 1; i++) {
		if (data[i].type == 'edit') {
			var title = data[i].title;
			console.log(title);

			var revParams = {
				action: 'query',
				titles: title,
				prop: 'revisions',
				rvprop: 'user|flags',
				rvlimit: 'max',
				rvstart: timeWeekAgo,
				format: 'json'
			};

			

			wiki_client.api.call(revParams, function(response) {
				console.log(response);
				console.log(response.pages);
				console.log(response.pages[0]);
			});
		}
	}
});
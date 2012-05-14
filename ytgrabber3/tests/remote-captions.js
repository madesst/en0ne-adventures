var fetcher = require('./utils/fetcher'),
		sax = require('./utils/sax'),
		ytutils = require('./utils/yt');

// get and parse http://video.google.com/timedtext?lang=en&v=Ky5p-L_m6BQ

function getRemoteCaptions(videoId, callback){

	var results = [];
	var baseUrl = 'http://video.google.com/timedtext?lang=en&v=' + videoId;

	var query = new fetcher();

	query.on('complete', function(err, data, rs){

		if (err){
			callback(err);
			return false;
		}

		if (data){

			var parser = sax.parser(true);

			parser.onopentag = function (node) {
				if (node['attributes']['start'] != undefined){
					results.push({
						start: node['attributes']['start']
					});
				}
			};

			parser.ontext = function (content) {
				var c = ytutils.removeWhiteSpaces(content);
				results[results.length - 1]['content'] = c;
			};

			parser.onend = function () {
				if (results.length > 0)
					callback(null, results);
				else
					callback('no captions for ' + videoId);

			};

			parser.write(data).close();

		} else {
			callback('no captions for ' + videoId);
		}

	}).fetch(baseUrl);

}

getRemoteCaptions('Ku42PPzYEqs', function(err, data){

	if (err != null){
		console.log(err);
		return false;
	}

	console.log(ytutils.glueCaptions(data));
});

getRemoteCaptions('Ky5p-L_m6BQ', function(err, data){

	if (err != null){
		console.log(err);
		return false;
	}

	console.log(ytutils.glueCaptions(data));
});
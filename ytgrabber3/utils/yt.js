var querystring = require('querystring');

module.exports.glueCaptions = function(captions, duration){

	var captionsCount = captions.length;

	if (!captionsCount)
		return [];

	var glueDuration = duration || 15;
	var mark = Math.floor(parseFloat(captions[0]['start']));
	var content = captions[0]['content'];
	var results = [];

	for (var i = 1; i < captionsCount; i++){

		if (Math.floor(parseFloat(captions[i]['start'])) < mark + glueDuration){
			content += ' ' + captions[i]['content'];
		} else {
			results.push({
				start: mark,
				content: content
			});

			mark = Math.floor(parseFloat(captions[i]['start']));
			content = captions[i]['content'];
		}
	}

	if (results[results.length - 1]['start'] != mark)
		results.push({
			start: mark,
			content: content
		});

	return results;
};

module.exports.ytSearchApiUrlBuilder = function(params){

	var url = 'http://gdata.youtube.com/feeds/api/videos';

	var constParams = {
		'max-results': 50,
		'v': 2,
		'hl': 'en_US',
		'lr': 'en',
		'caption': true,
		'alt': 'json'
	};

	// merge
	for (var key in params)
		constParams[key] = params[key];

	return url + '?' + querystring.stringify(constParams);

};

module.exports.removeWhiteSpaces = function(str){
	return str
			.replace(/\n/g, '')
			.replace(/\t/g, '')
			.replace(/&#39;/g, "'");
};

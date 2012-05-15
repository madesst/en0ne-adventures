var querystring = require('querystring'),
    sax = require('./sax'),
    ytutils = module.exports,
    fetcher = require('./fetcher'),
	combinator = require('./combinator');

module.exports.glueCaptions = function (captions, duration) {

    var captionsCount = captions.length;

    if (!captionsCount)
        return [];

    var glueDuration = duration || 25;
    var mark = Math.floor(parseFloat(captions[0]['start']));
    var content = captions[0]['content'];
    var results = [];

    for (var i = 1; i < captionsCount; i++) {

        if (Math.floor(parseFloat(captions[i]['start'])) < mark + glueDuration) {
            content += ' ' + captions[i]['content'];
        } else {

            // надо как-то дойти то последней точки и если что-то осталось, перенести это дело в
            // следующую отметочку

            var afterDot = '';

            if (-1 != content.indexOf('.')) {
                var dotIndex = content.lastIndexOf('.') + 1;
                if (content[dotIndex] == ' ')
                    afterDot = content.substring(dotIndex + 1, content.length);
                else
                    afterDot = content.substring(dotIndex, content.length);
                content = content.substring(0, dotIndex);
            }

            results.push({
                start:mark,
                content:content
            });

            mark = Math.floor(parseFloat(captions[i]['start']));
            content = afterDot + captions[i]['content'];
        }
    }

    if (results[results.length - 1]['start'] != mark)
        results.push({
            start:mark,
            content:content
        });

    return results;
};

module.exports.ytSearchApiUrlBuilder = function (params) {

    var url = 'http://gdata.youtube.com/feeds/api/videos';

    var constParams = {
        'max-results':50,
        'v':2,
        'hl':'en_US',
        'lr':'en',
        'caption':true,
        'alt':'json'
    };

    // merge
    for (var key in params)
        constParams[key] = params[key];

    return url + '?' + querystring.stringify(constParams);

};

module.exports.removeWhiteSpaces = function (str) {
    return str
        .replace(/\n/g, '')
        .replace(/\t/g, '')
        .replace(/&#39;/g, "'");
};

module.exports.getCaptionsAsync = function (videoId, callback) {

	if (!videoId){
		callback('No video id');
		return false;
	}

    var workUrl = 'http://video.google.com/timedtext?lang=en&v=' + videoId,
        results = [],
        query = new fetcher();

    query.on('complete',
        function (err, data, rs) {

            if (err) {
                callback(err);
                return false;
            }

            if (!data || data.length == 0) {
                callback('no captions for ' + videoId);
                return false;
            }

            var parser = sax.parser(true);

            parser.onopentag = function (node) {
                if (node['attributes']['start'] != undefined) {
                    results.push({
                        start:node['attributes']['start']
                    });
                }
            };

            parser.ontext = function (content) {
                results[results.length - 1]['content'] = ytutils.removeWhiteSpaces(content);
            };

            parser.onend = function () {
                if (results.length > 0)
                    callback(null, results);
                else
                    callback('no captions for ' + videoId);

            };

            parser.write(data).close();

        }).fetch(workUrl);

};

module.exports.getAllPossibleUrlsForSearchApi = function(){

	var comb = new combinator();

	comb.addVariants('orderBy', ['viewCount', 'rating', 'published', 'relevance']);
	comb.addVariants('time', ['today', 'this_week', 'this_month', 'all_time']);
	comb.addVariants('duration', ['short', 'medium', 'long']);
	comb.addVariants('q', [
		'',
		'fun',
		'cars',
		'news',
		'autos',
		'comedy',
		'entertainment',
		'gaming',
		'howto',
		'activism',
		'people',
		'pets',
		'science',
		'travel',
		'sport'
	]);
	comb.addVariants('category', [
		'',
		'Autos',
		'Animals',
		'Film',
		'Music',
		'Sports',
		'Shortmov',
		'Travel',
		'Games',
		'Videoblog',
		'People',
		'Comedy',
		'Entertainment',
		'News',
		'Howto',
		'Education',
		'Tech',
		'Nonprofit',
		/*'Movies',
		'Movies_anime_animation',
		'Movies_action_adventure',
		'Movies_classics',
		'Movies_comedy',
		'Movies_documentary',
		'Movies_drama',
		'Movies_family',
		'Movies_foreign',
		'Movies_horror',
		'Movies_sci_fi_fantasy',
		'Movies_thriller',
		'Movies_shorts',*/
		'Shows',
		'Trailers'
	]);

	var tmp = {}; var urls = [];
	while((tmp = comb.next()) !== false)
		urls.push(ytutils.ytSearchApiUrlBuilder(tmp));

	return urls;
};
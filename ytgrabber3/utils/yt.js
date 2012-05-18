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
    var content = captions[0]['content'] || '';
    var results = [];

    for (var i = 1; i < captionsCount; i++) {

        if (captions[i].content == '' || captions[i].start == undefined)
            continue;

        if (Math.floor(parseFloat(captions[i]['start'])) < mark + glueDuration) {
            content += ' ' + captions[i]['content'];
        } else {

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

    if (results[results.length - 1] && results[results.length - 1]['start'] != mark)
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
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/  /g, ' ');
};

module.exports.htmlEscape = function(str){

	return str.split('&').join('&amp;')
			.split('<').join('&lt;')
			.split('>').join('&gt;')
			.split('"').join('&quot;')
			.split("'").join('&#39;')
}

module.exports.getCaptionsAsync = function (videoId, callback) {

	if (!videoId){
		callback('No video id');
		return false;
	}

    var workUrl = 'http://video.google.com/timedtext?lang=en&v=' + videoId,
        results = [],
        query = new fetcher();

    query.on('complete',
        function (err, data) {

            if (err) {
                callback(err);
                return false;
            }

            if (!data || data.length == 0) {
                callback('no captions for ' + videoId);
                return false;
            }

            (function(xml){

                var parser = sax.parser(true),
                    currTag = '',
                    inText = false,
                    data = '';

                parser.onopentag = function(node){

                    inText = false,
                    currTag = node.name;

                    if (currTag == 'text' && node['attributes']['start'] != undefined)
                        results.push({
                            start:node['attributes']['start']
                        });

                };

                parser.onclosetag = function(){
                    inText = false;
                    currTag = '';
                    data = '';
                };

                parser.ontext = function (chunk){

                    if (currTag == 'text'){
                        if (inText)
                            results[results.length - 1]['content'] += chunk;
                        else
                            results[results.length - 1]['content'] = chunk;
                    }

                    inText = true;
                };

                parser.onend = function () {
                    if (results.length > 0)
                        callback(null, results);
                    else
                        callback('no captions for ' + videoId);

                };

                parser.write(xml).close();

                data = null;

            })(data);

        }).fetch(workUrl);

};

module.exports.getAllPossibleUrlsForSearchApi = function(){

	var comb = new combinator();

	comb.addVariants('orderBy', ['viewCount', 'rating', 'published', 'relevance']);
	comb.addVariants('time', ['today', 'this_week', 'this_month', 'all_time']);
	comb.addVariants('duration', ['short', 'medium']);
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

module.exports.getVideoIdFromFeedIdField = function(feedField){

    var parts = feedField.split(':');

    if (!parts.length)
        return false;

    for (var i = 0; i < parts.length; i++)
        if (parts[i] == 'video' && parts[i+1] != undefined)
            return parts[i+1];

    return false;
}

module.exports.embedAllowed = function(accessList){

    if (!accessList)
        return false;

    for (var i in accessList)
        if (accessList[i].action == 'embed' && accessList[i].permission == 'allowed')
            return true;

    return false;
}

module.exports.getNextLinkFromFeed = function(links){

    if (!links)
        return false;

    for (var i in links)
        if (links[i].rel == 'next')
            return links[i].href;

    return false;
}

module.exports.getVideoCategoryLabelAndTerm = function(category){

	for (var i in category){
		if (category[i]['scheme'] == "http://gdata.youtube.com/schemas/2007/categories.cat")
			return {
				label: category[i]['label'],
				term: category[i]['term']
			};
	}

	return '';
}
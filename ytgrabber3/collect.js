var ytutils = require('./utils/yt'),
		fetcher = require('./utils/fetcher'),
		fs = require('fs');

var workUrls = ytutils.getAllPossibleUrlsForSearchApi();

var videos = {};

var parseVideos = function(feed, callback){

	if (!feed)
		return false;

	if (!feed.entry)
		return false;

	feed.entry.forEach(function(el){

		var allowed = ytutils.embedAllowed(el.yt$accessControl);

		var likes = 0;
		if (el['yt$rating'] && el['yt$rating']['numLikes'] != undefined)
			likes = el['yt$rating']['numLikes'];

		if (allowed && likes > 10){

			var videoId = ytutils.getVideoIdFromFeedIdField(el.id.$t);

			ytutils.getCaptionsAsync(videoId, function(err, captions){

				if (err)
					return false;

				videos[videoId] = {
					title: el.title.$t
				};

				console.log('[' + videoId + ']', '[' + videos[videoId].title + ']');

				var tmp = {};
				tmp[videoId] = {
					title: el.title.$t,
					captions: captions
				};

				var dataFile = fs.createWriteStream('./data/videos', {'flags': 'a'});
				dataFile.end(JSON.stringify(tmp) + ",\n");

                captions = null; // maybe it will help with memory leak

			});

		} else {
			console.log('Embed is not allowed');
		}
	});

	console.log('videos count ', Object.keys(videos).length);
	console.log('urls left ', workUrls.length);
};

var mainFetcher = new fetcher();

mainFetcher.on('complete', function(err, data){

	var nextRequest = function(){
		setTimeout(function(){
			var nextUrl = workUrls.pop();
			if (nextUrl){
				console.log('fetching ', nextUrl);
				mainFetcher.fetch(nextUrl);
			}
		}, 2000);
	};

	var getNextLink = function(links){
		if (!links)
			return false;

		for (var i in links)
			if (links[i].rel == 'next')
				return links[i].href;

		return false;
	};

	if (err){
		// log error and call next request
		console.log(err);
		nextRequest();
		return false;
	}

	if (!data){
		console.log('Empty response');
		nextRequest();
		return false;
	}

	// data exists let's work

	data = JSON.parse(data);

	// get videos
	parseVideos(data.feed);

	var nextLink = getNextLink(data.feed.link);

	if (!nextLink){
		nextRequest();
		return false;
	}

	data = null;

	// per page
	var pager = new fetcher();

	pager.on('complete', function(err, data){

		var nextPage = function(nextUrl){
			setTimeout(function(){
				console.log('pager fetch ', nextUrl);
				pager.fetch(nextUrl);
			}, 2000);
		};

		if (err){
			console.log('pager error', err);
			nextRequest();
			return false;
		}

		if (!data){
			nextRequest();
			return false;
		}

		data = JSON.parse(data);

		parseVideos(data.feed);

		var nextPage = getNextLink(data.feed.link);

		data = null;

		if (!nextPage){
			nextRequest();
			return false;
		} else {
			pager.fetch(nextPage);
		}

	}).fetch(nextLink);

}).fetch(workUrls.pop());
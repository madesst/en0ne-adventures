var ytutils = require('./utils/yt'),
    fetcher = require('./utils/fetcher'),
    fs = require('fs');

var possibleUrls = ytutils.getAllPossibleUrlsForSearchApi(),
    videos = {},
    notAllowedVideos = 0,
    notEnoughLikesVideos = 0,
    repeatedVideos = 0,
    addedVideos = 0,
    globalRequestDelay = 1000,
	currFileIndex = 0;

var mainUrlsFetcher = new fetcher(),
    pagesFetcher = new fetcher();

// splice all data to some files
setInterval(function(){

	var fileName = './data/data-' + currFileIndex + '.xml';

	fs.stat(fileName, function(err, stats){
		if (err)
			return false;
		if (stats.size / 1024 / 1024 > 5)
			++currFileIndex;
	});

}, 3000);

var saveVideos = function(videoList){

	if (!videoList || !videoList.length)
		return false;

    videoList.forEach(function(video){

        var embedAllowed = ytutils.embedAllowed(video.yt$accessControl),
            videoId = ytutils.getVideoIdFromFeedIdField(video.id.$t),
            likes = 0,
            disLikes = 0;

        if (!embedAllowed){
            console.log('embed is not allowed for', videoId);
            notAllowedVideos++;
            return true;
        }

        if (video['yt$rating'] && video['yt$rating']['numLikes'] != undefined){
            likes = video['yt$rating']['numLikes'];
            disLikes = video['yt$rating']['numDislikes'];
        }

        if (likes < 10 || likes - disLikes < 0){
            console.log('not enough likes for', videoId);
            notEnoughLikesVideos++;
            return true;
        }

        if (videos[videoId] != undefined){
            repeatedVideos++;
            return true;
        } else {
            videos[videoId] = true; // just a mark for unique support
        }

        console.log('working on [', videoId, ']');

        ytutils.getCaptionsAsync(videoId, function(err, data){

            if (err || !data || data.length == 0) return false;

            data = ytutils.glueCaptions(data);

			var category = ytutils.getVideoCategoryLabelAndTerm(video.category);

            // prepare content for export
            var xml = "<video>\n" +
                "<id>" + videoId + "</id>\n" +
                "<title>" + ytutils.htmlEscape(video.title.$t) + "</title>\n" +
				"<viewCount>" + video.yt$statistics.viewCount + "</viewCount>\n" +
                "<categoryTerm>" + category.term  + "</categoryTerm>\n" +
				"<categoryLabel>" + category.label + "</categoryLabel>\n" +
                "<captions>\n";

            for(var i in data)
                xml += "<caption start=\"" + data[i].start + "\">" + data[i].content + "></caption>\n";

            data = null;

            xml += "</captions>\n" +
                "</video>\n";

			var fileName = './data/data-' + currFileIndex + '.xml';

            var file = fs.createWriteStream(fileName, {'flags': 'a'});
            file.end(xml, 'utf8');

            console.log('---');
            console.log('urls left:', possibleUrls.length);
            console.log('videos saved:', addedVideos);
            console.log('not allowed videos:', notAllowedVideos);
            console.log('not enough likes:', notEnoughLikesVideos);
            console.log('duplicates:', repeatedVideos);
            console.log('---');

            addedVideos++;

            data = null;

        });

    });
}

var nextMainRequest = function(){
    setTimeout(function(){
        var nextUrl = possibleUrls.pop();
        if (nextUrl){
            console.log('[main-request-fetcher] ', nextUrl);
            mainUrlsFetcher.fetch(nextUrl);
        }
    }, globalRequestDelay);
};

var nextPageRequest = function(nextUrl){
    setTimeout(function(){
        console.log('[pager-fetcher] ', nextUrl);
        pagesFetcher.fetch(nextUrl);
    }, globalRequestDelay);
};

mainUrlsFetcher.on('complete', function(err, data){

    if (err){
        // log error and call next request
        console.log(err);
        nextMainRequest();
        return false;
    }

    if (!data){
        console.log('Empty response');
        nextMainRequest();
        return false;
    }

    // ok, we've got a data let's parse it

    data = JSON.parse(data);

    console.log('total results for main request = ', data.feed.openSearch$totalResults.$t);

    if (data.feed.openSearch$totalResults.$t == 0){
        nextMainRequest();
        return false;
    }

    saveVideos(data.feed.entry);

    var nextPagerUrl = ytutils.getNextLinkFromFeed(data.feed.link);

    data = null;

    if (!nextPagerUrl){
        nextMainRequest();
        return false;
    }

    nextPageRequest(nextPagerUrl);

});

pagesFetcher.on('complete', function(err, data){

    if (err){
        console.log('pager error', err);
        nextMainRequest();
        return false;
    }

    if (!data){
        nextMainRequest();
        return false;
    }

    // ok, we've got data let's parse it

    data = JSON.parse(data);

    saveVideos(data.feed.entry);

    var nextPagerUrl = ytutils.getNextLinkFromFeed(data.feed.link);

    data = null;

    if (!nextPagerUrl){
        nextMainRequest();
        return false;
    }

    nextPageRequest(nextPagerUrl);

});

// let's start

mainUrlsFetcher.fetch(possibleUrls.pop());
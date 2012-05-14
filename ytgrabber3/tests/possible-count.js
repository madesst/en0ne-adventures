var combinator = require('./../utils/combinator');
var ytutils = require('./../utils/yt');
var fetcher = require('./../utils/fetcher');

var comb = new combinator();

comb.addVariants('orderBy', ['viewCount', 'rating', 'published', 'relevance']);
comb.addVariants('time', ['today', 'this_week', 'this_month', 'all_time']);
comb.addVariants('duration', ['short', 'medium', 'long']);
comb.addVariants('q', ['', 'fun', 'cars', 'news', 'autos', 'comedy', 'entertainment', 'gaming', 'howto', 'activism', 'people', 'pets', 'science', 'travel', 'sport']);
comb.addVariants('category', ['', 'Autos', 'Animals', 'Film', 'Music', 'Sports', 'Shortmov', 'Travel', 'Games', 'Videoblog', 'People', 'Comedy', 'Entertainment', 'News', 'Howto', 'Education', 'Tech', 'Nonprofit', 'Movies', 'Movies_anime_animation', 'Movies_action_adventure', 'Movies_classics', 'Movies_comedy', 'Movies_documentary', 'Movies_drama', 'Movies_family', 'Movies_foreign', 'Movies_horror', 'Movies_sci_fi_fantasy', 'Movies_thriller', 'Movies_shorts', 'Shows', 'Trailers']);

var tmp = {}; var urls = [];
while((tmp = comb.next()) !== false)
	urls.push(ytutils.ytSearchApiUrlBuilder(tmp));

console.log('urls count: ', urls.length);

var possibleCount = 0;
var query = new fetcher();

query.on('complete', function(err, data, rs){

	if (data != null){
		data = JSON.parse(data);
		if (typeof(data.feed.openSearch$totalResults.$t) != 'undefied'){

			var total = data.feed.openSearch$totalResults.$t;
			if (1000 < total)
				total = 1000;

			possibleCount += total;

			console.log('total for feed ' + total);
			console.log('possible count ' + possibleCount);
			console.log('urls left ' + urls.length);
		}
	}

	setTimeout(function(){
		query.fetch(urls.pop());
	}, 1500);

}).fetch(urls.pop());

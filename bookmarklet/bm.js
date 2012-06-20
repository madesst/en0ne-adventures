var ccbookmarklet = (function(){

	var appendScriptTag = function(src){
		var js = document.createElement('script');
		js.async = true;
		js.src = src;
		document.getElementsByTagName('head')[0].appendChild(js);
	};

	var waitForJquery = function(callback){

		var jquery = typeof(jQuery);

		if (jquery != 'undefined')
			callback();
		else
			setTimeout(function(){
				if (jquery != 'undefined')
					callback();
				else
					waitForJquery(callback);
			}, 1000);
	};

	var getYoutubeIframes = function(){
		var results = [];
		jQuery('iframe').each(function(i, o){
			if (jQuery(o).attr('src'))
				if (jQuery(o).attr('src').indexOf('youtube') != -1)
					results.push(jQuery(o));
		});
		return results;
	};

	var getYoutubeEmbeds = function(){
		var results = [];
		jQuery('embed').each(function(i, o){
			if (jQuery(o).attr('src'))
				if (jQuery(o).attr('src').indexOf('ytimg') != -1)
					results.push(jQuery(o));
		});
		return results;
	}

	return {
		bootstrap: function(){
			if (typeof(jQuery) == 'undefined')
				appendScriptTag('http://code.jquery.com/jquery-1.7.2.min.js');

			appendScriptTag('http://www.youtube.com/player_api');

			waitForJquery(function(){
				/*var ytplayers = getYoutubeIframes();
				jQuery(ytplayers).each(function(i, o){
					jQuery(o).remove();
				});

				var embeds = getYoutubeEmbeds();

				jQuery(embeds).each(function(i, o){
					jQuery(o).remove();
				});*/



			});
		}
	};
})();

ccbookmarklet.bootstrap();
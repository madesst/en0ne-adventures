var ccbookmarklet = (function(){

	/* noticer */
	var noticer_ = function(){
		this.timer = 0;
		this.$noticer = null;
		this.$msgPlaceHolder = null;
		this.params = {
			ttl: 1000,
			fadeDelay: 300
		};

		var el = this;

		jQuery(function(){
			if (!jQuery('.b-noticer').length)
				jQuery('body').append('<div class="b-noticer" style="display: none;"><p></p></div>');
			el.$noticer = jQuery('.b-noticer');
			el.$msgPlaceHolder = el.$noticer.find('p');
		});
	};

	noticer_.prototype = {
		show: function(msg, callback){
			if (this.$noticer != null){
				this.$msgPlaceHolder.html(msg);
				this.$noticer.fadeIn(this.params.fadeDelay, function(){
					if (callback)
						callback();
				});
			}
		},
		hide: function(callback){
			this.$noticer.fadeOut(this.params.fadeDelay, function(){
				if (callback)
					callback();
			});
		},
		flash: function(msg){
			var ctx = this;
			if (!this.timer && !this.$noticer.is(':visible')){
				this.show(msg, function(){
					ctx.timer = setTimeout(function(){
						ctx.hide(function(){
							clearTimeout(ctx.timer); ctx.timer = 0;
						});
					}, ctx.params.ttl);
				});
			}
		}
	};
	/**/

	/**/
	var videoPlayers =  {},
			playerIdIndex = 0;
	/**/

	var appendScriptTag = function(src){
		var js = document.createElement('script');
		js.async = true;
		js.src = src;
		document.getElementsByTagName('head')[0].appendChild(js);
	};

	var appendStyleTag = function(href){
		var css = document.createElement('link');
		css.setAttribute("rel", "stylesheet")
		css.setAttribute("type", "text/css")
		css.setAttribute("href", href)
		document.getElementsByTagName('head')[0].appendChild(css);
	}

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
			}, 500);
	};

	var waitForYT = function(callback){
		var yt = typeof(YT);

		if (yt != 'undefined')
			callback();
		else
			setTimeout(function(){
				if (yt != 'undefined')
					callback();
				else
					waitForYT(callback);
			}, 500);
	};

	var waitForPlayer = function(player, callback){
		var loaded = typeof(player.playVideo);

		if (loaded != 'undefined')
			callback(player);
		else
			setTimeout(function(){
				if (loaded != 'undefined')
					callback(player);
				else
					waitForPlayer(player, callback);
			}, 500);
	};

	var createClipButton = function(top, left){
		jQuery('<div class="cc-clip-button"></div>').css({top: top + 'px', left: left + 'px'}).appendTo('body');
	};

	var playerReadyEvent = function(event){
		console.log('player-ready', event.target.getIframe());
	};

	var getYoutubeIframes = function(){
		var results = [];
		jQuery('iframe').each(function(i, o){
			var $o = jQuery(o);

			if ($o.attr('src')){
				if ($o.attr('src').indexOf('youtube') != -1){
					if (!$o.attr('id')){
						$o.attr('id', 'cc-video-player-' + playerIdIndex);
						playerIdIndex++;
					}
					results.push(o);
				}
			}
		});
		return results;
	};

	var initIFramePlayers = function(iframes){
		var results = {};
		iframes.each(function(i, o){
			var id = jQuery(o).attr('id');
			results[id] = new YT.Player(id);
		});
		return results;
	};

	var getYoutubeEmbeds = function(){
		var results = [];
		jQuery('embed').each(function(i, o){
			var $o = jQuery(o);
			if ($o.attr('src'))
				if ($o.attr('src').indexOf('ytimg') != -1)
					results.push(o);
		});
		return results;
	};

	return {

		loadScripts: function(){

			appendStyleTag('http://html/cliplock/bookmarklet/bm.css');
			appendStyleTag('http://html/cliplock/bookmarklet/utils/b-noticer.css');
			appendStyleTag('http://html/cliplock/bookmarklet/utils/clip-button.css');

			if (typeof(jQuery) == 'undefined')
				appendScriptTag('http://code.jquery.com/jquery-1.7.2.min.js');

			appendScriptTag('http://www.youtube.com/player_api');

		},

		bootstrap: function(){
			waitForJquery(function(){
				waitForYT(function(){

					var noticer = new noticer_();
					noticer.flash('jQuery and YTApi loaded');

					var iframes = getYoutubeIframes();
					var players = initIFramePlayers(iframes);

					console.log(players);

					for(var key in players)
						console.log(key);
				});
			});
		}
	};
})();

ccbookmarklet.loadScripts();
ccbookmarklet.bootstrap();
if (typeof api == 'undefined')
	api = {};

(function(){

	var noticer = function(){
		this.timer = 0;
		this.$noticer = null;
		this.$msgPlaceHolder = null;
		this.params = {
			ttl: 3000,
			fadeDelay: 300
		};
	};

	noticer.prototype.show = function(msg, callback){
		if (this.$noticer != null){
			this.$msgPlaceHolder.html(msg);
			this.$noticer.fadeIn(this.params.fadeDelay, function(){
				if (callback)
					callback();
			});
		}
	}

	noticer.prototype.hide = function(callback){
		this.$noticer.fadeOut(this.params.fadeDelay, function(){
			if (callback)
				callback();
		});
	}

	noticer.prototype.flash = function(msg){
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

	// exports
	api.noticer = new noticer();

	// build noticer on dom load
	$(function(){
		if (!$('.b-noticer').length)
			$('body').append('<div class="b-noticer" style="display: none;"><p></p></div>');
		api.noticer.$noticer = $('.b-noticer');
		api.noticer.$msgPlaceHolder = api.noticer.$noticer.find('p');
	});

})();
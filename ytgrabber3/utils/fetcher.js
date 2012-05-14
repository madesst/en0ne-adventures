(function(){

	var events = require('events'),
			util = require('util'),
			http = require('http'),
			Url = require('url');

	var _fetcher = function(){};

    module.exports = _fetcher;

	util.inherits(_fetcher, events.EventEmitter);

	_fetcher.prototype.fetch = function(url, onComplete){

        // for callback style
		if (typeof(onComplete) == 'function')
			self.on('complete', onComplete);

        var self = this,
            urlParts = Url.parse(url);

		http.get({

			host: urlParts.host,
			port: (urlParts.port || 80),
			path: urlParts.path

		}, function(rs){

			var buf = '';
			rs.on('data', function(chunk){
				buf += chunk;
			});

			rs.on('end', function(){
				if (rs.statusCode == 200){
					self.emit('complete', null, buf, rs);
				} else {
					self.emit('complete', '[fetcher error: status code = ' + rs.statusCode + ']', null, rs);
				}
			});

		}).on('error', function(err){
			self.emit('complete', err);
		});

	};

})();
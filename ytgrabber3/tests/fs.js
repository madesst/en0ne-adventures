var fs = require('fs');

fs.stat('./test.xml', function(err, stats){
	console.log(stats.size / 1024 / 1024);
});
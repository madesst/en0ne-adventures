var fs = require('fs'),
    sax = require('./../utils/sax');

var xml = fs.readFileSync('data.xml', 'utf8');
var results = [];

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
		console.log(results);
	};

	parser.write(xml).close();

	data = null;

})(xml);
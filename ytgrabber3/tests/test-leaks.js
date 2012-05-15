var fetcher = require('./../utils/fetcher'),
		fs = require('fs');

var n = 0;
var str = 'RANDOM STRING ';
var hash = {};

setInterval(function(){

	var str = '';
	for (var i = 0; i < 90000; i++)
		str += i + '666' + i;

	var dataFile = fs.createWriteStream('../data/testdata', {'flags': 'a'});
	dataFile.end(str);

}, 1);
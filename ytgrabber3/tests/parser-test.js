var fs = require('fs'),
    sax = require('./../utils/sax');

var xml = fs.readFileSync('data.xml', 'utf8');

(function(xml){

    var parser = sax.parser(true),
        currTag = '',
        inText = false,
        data = '';

    parser.onopentag = function(node){
        inText = false;
        currTag = node.name;
    };

    parser.onclosetag = function(){

        if (currTag == 'text')
            console.log(data, "\n\n");

        inText = false;
        currTag = '';
        data = '';
    };

    parser.ontext = function (chunk){

        if (currTag == 'text')
            if (inText)
                data += chunk;
            else
                data = chunk;

        inText = true;
    };

    parser.write(xml).close();

})(xml);
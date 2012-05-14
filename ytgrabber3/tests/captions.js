
var captions = [
	{
		start: '7.054',
		content: 'CouchSurfing is not just about surfing someone else\'s couch,'
	},
	{
		start: '10.557',
		content: 'it\'s about the whole experience.'
	},
	{
		start: '12.766',
		content: 'There\'s so many lovely people who are drawn to CouchSurfing.'
	},
	{
		start: '15.152',
		content: 'It\'s really altruistic.'
	},
	{
		start: '21.13',
		content: 'CouchSurfing\'s fantastic. Just think about the option of having friends all over, of making a network.'
	},
	{
		start: '26.54',
		content: 'The perfect CouchSurfer is someone who\'s very respectful,'
	},
	{
		start: '30.155',
		content: 'and open to, you know, a connection.'
	},
	{
		start: '35.062',
		content: 'If you\'re just starting with CouchSurfing and you\'re unsure where to go with it or what to do with it,'
	},
	{
		start: '40.249',
		content: 'the first step is to fill out the profile.'
	},
	{
		start: '43.502',
		content: 'You want to put effort in to the CouchSurfing profile because I need to know that you want to be involved.'
	},
	{
		start: '48.901',
		content: 'So you have an opportunity to put why you&#39;re doing it.'
	},
	{
		start: '51.642',
		content: 'Is it a lust for life?  Is it because you want to see different places?'
	},
	{
		start: '55.158',
		content: 'After you fill out your profile, go to some events, meet people and continue to adapt your profile.'
	},
	{
		start: '62.896',
		content: 'When yo\'re looking for a host, first step, read the profile.'
	},
	{
		start: '65.947',
		content: 'Read the whole profile.'
	},
	{
		start: '67.565',
		content: 'Check the experience of this person.'
	},
	{
		start: '70',
		content: 'If they have references, great. If they\'re vouched, amazing.'
	},
	{
		start: '73.293',
		content: 'And I sometimes also check the friends list, just to see does he have a lot of close friends.'
	},
	{
		start: '77.624',
		content: 'You have to check the couch information so that you know what to expect.'
	},
	{
		start: '81.056',
		content: 'Verification is a great thing, just that nice little green check box.'
	},
	{
		start: '84.614',
		content: 'Sometimes if there\'s a new CouchSurfer, I\'ll actually give them more of a chance because they haven\'t had a chance before, as well.'
	},
	{
		start: '95.971',
		content: 'With the initial Couch Request, I think of it as more of a first \'hello.\''
	},
	{
		start: '100.17',
		content: 'I would like the surfer to read my profile first and to see who I am.'
	}
];


var glueCaptions = function(captions, duration){

	var captionsCount = captions.length;

	if (!captionsCount)
		return [];

	var glueDuration = duration || 15;
	var mark = Math.floor(parseFloat(captions[0]['start']));
	var content = captions[0]['content'];
	var results = [];

	for (var i = 1; i < captionsCount; i++){

		if (Math.floor(parseFloat(captions[i]['start'])) < mark + glueDuration){
			content += ' ' + captions[i]['content'];
		} else {
			results.push({
				start: mark,
				content: content
			});

			mark = Math.floor(parseFloat(captions[i]['start']));
			content = captions[i]['content'];
		}
	}

	results.push({
		start: mark,
		content: content
	});

	return results;
};

console.log(glueCaptions(captions));
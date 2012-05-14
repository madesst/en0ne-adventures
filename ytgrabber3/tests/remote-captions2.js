var ytutils = require('./../utils/yt');

ytutils.getCaptionsAsync('Ky5p-L_m6BQ', function(err, data){
    console.log(ytutils.glueCaptions(data));
});
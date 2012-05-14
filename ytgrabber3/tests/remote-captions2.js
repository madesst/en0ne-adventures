var ytutils = require('./../utils/yt');

//ytutils.getCaptionsAsync('Ky5p-L_m6BQ', function(err, data){
//    console.log(ytutils.glueCaptions(data));
//});

ytutils.getCaptionsAsync('OFyPCuHFDMI', function(err, data){

    if (err){
        console.log(err);
        return false;
    }

    console.log(ytutils.glueCaptions(data));
});

$(function(){
    $('.viewport-scroll').draggableViewport();

    setTimeout(function(){
        $('.viewport-scroll').scrollTo('.target', 800);
        setTimeout(function(){
            $('.viewport-scroll').scrollTo('.notice:first', 800);
        }, 3000);
    }, 3000);

    $('.viewport-scroll .notice').mousedown(function(e){
        e.stopPropagation();
    });

    setTimeout(function(){
        $('.viewport-scroll img').attr({src: 'img/huge-2.jpg'});
        setTimeout(function(){
            $('.viewport-scroll img').attr({src: 'img/huge-3.jpg'});
        }, 10000)
    }, 15000);
});

//var coordsPair = function(x, y){
//    return x + 'px ' + y + 'px'
//}
//
//$(function(){
////    $('.viewport').css({backgroundPosition: coordsPair(-200, -600)});
//
//    var drag = false,
//        _x, _y;
//
//    $('.viewport').mousedown(function(e){
//        drag = true;
//        _x = e.pageX;
//        _y = e.pageY;
//    });
//
//    $('.viewport').mousemove(function(e){
//
//        var deltaX, deltaY,
//            bgPosition = $('.viewport').css('backgroundPosition').split(' '),
//            currX = parseInt(bgPosition[0].replace(/[^-0-9]/g, '')),
//            currY = parseInt(bgPosition[1].replace(/[^-0-9]/g, ''));
//
//        if (drag){
//
//            deltaX = _x - e.pageX;
//            deltaY = _y - e.pageY;
//
//            currX -= deltaX;
//            currY -= deltaY;
//
//            _x = e.pageX;
//            _y = e.pageY;
//
//            $('.viewport').css({backgroundPosition: coordsPair(currX, currY)});
//        }
//    });
//
//    $(document).mouseup(function(){
//        drag = false;
//
//        var bgPosition = $('.viewport').css('backgroundPosition').split(' '),
//            currX = parseInt(bgPosition[0].replace(/[^-0-9]/g, '')),
//            currY = parseInt(bgPosition[1].replace(/[^-0-9]/g, ''));
//
//        if (currX > 0)
//            currX = 0;
//        if (currY > 0)
//            currY = 0;
//
//        $('.viewport').animate({backgroundPositionX: currX + 'px', backgroundPositionY: currY + 'px'});
//    });
//});

//function pairs(top, left){
//    return {
//        top: top + 'px',
//        left: left + 'px'
//    }
//}
//
//function currPairs(top, left){
//
//    var _top, _left;
//
//    if (top > 0)
//        _top = '+=' + Math.abs(top) + 'px';
//    else
//        _top = '-=' + Math.abs(top) + 'px';
//
//    if (left > 0)
//        _left = '+=' + Math.abs(left) + 'px';
//    else
//        _left = '-=' + Math.abs(left) + 'px';
//
//    return {
//        top: _top,
//        left: _left
//    }
//}
//
//$(function(){
//
//    var drag = false,
//        $viewport = $('.viewport-scroll'),
//        x, y;
//
//    $viewport.mousedown(function(e){
//        drag = true,
//            x = e.pageX,
//            y = e.pageY;
//
//        return false;
//    });
//
//    $viewport.mousemove(function(e) {
//        if (!drag)
//            return false;
//
//        var deltaX = x - e.pageX,
//            deltaY = y - e.pageY;
//
//        x = e.pageX,
//        y = e.pageY;
//
//        $(this).scrollTo(currPairs(deltaY, deltaX));
//    });
//
//    $(document).mouseup(function(){
//        console.log(drag);
//        drag = false;
//    });
//
//});
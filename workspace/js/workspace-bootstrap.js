$(function(){

    var $img = $('.viewport img');

    $img.bind('load', function(){
        $img.fadeIn('slow');
    });

    // load first img
    setTimeout(function(){
        $img.attr({
            src: $('.page:first').attr('data-img')
        });
    }, 5000);

    $('.viewport, .workspace .panel').draggableViewport();

    $('.page').click(function(){

        var $this = $(this);

        $img.fadeOut(500, function(){
            setTimeout(function(){
                $img.attr({
                    src: $this.attr('data-img')
                });
            }, 2000);
        });
    });

    var $controls = $('.controls'),
        hideControlsTimer = null;

    $('.viewport').mousemove(function(){
        clearTimeout(hideControlsTimer); hideControlsTimer = 0;

        if (!$controls.is(':visible'))
            $controls.fadeIn(200);

        hideControlsTimer = setTimeout(function(){
            $controls.fadeOut(200);
        }, 4000);
    });

    $controls.mousemove(function(){
        clearTimeout(hideControlsTimer); hideControlsTimer = 0;
    }).mouseout(function(){
            hideControlsTimer = setTimeout(function(){
                $controls.fadeOut(200);
            }, 4000);
        });


    $('.zoom').click(function(){
        var currZoom = parseFloat($img.css('zoom'));
        $(this).hasClass('plus') ? currZoom += 0.1 : currZoom -= 0.1;
        $img.css({zoom: currZoom});
    });

});
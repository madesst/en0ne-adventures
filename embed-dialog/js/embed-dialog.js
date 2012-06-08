(function($){

    $.fn.embedDialog = function(){

        var $el = $(this);

        var bindEvents = function(){
            $el.find('.box').live('click', function(){
                if (!$(this).hasClass('active')){
                    $el.find('.box').removeClass('active');
                    $(this).addClass('active');
                }
            });
        };

        bindEvents();
        return this;
    };

})(jQuery);


$(function(){
    $('.embed-dialog').embedDialog();
});
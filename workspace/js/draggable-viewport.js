(function ($) {
    $.fn.draggableViewport = function () {

        var dragMode = false;

        var normalizeOffsets = function (dy, dx) {
            return {
                top:(dy > 0) ? '+=' + Math.abs(dy) + 'px' : '-=' + Math.abs(dy) + 'px',
                left:(dx > 0) ? '+=' + Math.abs(dx) + 'px' : '-=' + Math.abs(dx) + 'px'
            };
        };

        $(this).each(function(i, o){

            var $this = $(o), x, y;

            $this.mousedown(function (e) {
                dragMode = true, x = e.pageX, y = e.pageY;
                return false;
            });

            $this.mousemove(function (e) {
                if (!dragMode) return false;

                var dx = x - e.pageX,
                    dy = y - e.pageY;

                x = e.pageX, y = e.pageY;

                $this.scrollTo(normalizeOffsets(dy, dx));
            });

        });

        $(document).mouseup(function(e){
            dragMode = false;
        });

        return this;
    };
})(jQuery);
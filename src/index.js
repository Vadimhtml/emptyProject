$(window).load(function () {
    $('body').plug();
});

(function ($) {
    $.fn.plug = function () {
        var $this = $(this);
        $this.html('Empty project');
    };
}(jQuery));

var myJS = (function() {

    var _this = {};
    
    _this.resize = function () {

        var windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            imgHeight = (windowWidth * 0.666667) * 0.8,
            imgWidth = (windowHeight * 1.5) * 0.8,
            btnTop,
            marginTop;
        
        if (windowHeight > (windowWidth * 0.666667)) {
            $('div.photo > img, div.photo div').width(windowWidth * 0.8);
            $('div.photo > img, div.photo div').height(imgHeight);
            $('#logo').width('40%');
        } else {
            $('div.photo > img, div.photo div').height(windowHeight * 0.8);
            $('div.photo > img, div.photo div').width(imgWidth);            
            $('#logo').width('25%');
        }
        btnTop = windowHeight * 0.5;
        $('button.nav-btn').css('top', btnTop);
        marginTop = (windowHeight - $('div.photo > img, div.photo div').height()) * 0.5;
        $('div.photo > img, div.photo div').css('margin-top', marginTop);
    };

    _this.launchFullScreen = function(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    };

    _this.cancelFullscreen = function () {
        if(document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };

    _this.markCurrentPhoto = function () {
        var pos = mySwipe.getPos();
        var thisPhoto = $('#slider').find('[data-index="'+ pos +'"]');
        $('div.photo').removeClass('current');
        $(thisPhoto).addClass('current');
    };

    return _this;
})();


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-46841984-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function () {

    window.mySwipe = new Swipe(document.getElementById('slider'), {
        callback: function () {
            myJS.markCurrentPhoto();
            var newTitle = $('div.photo.current img').attr('alt');
            var position = mySwipe.getPos();
            document.title = "Michel Ickler - " + newTitle;
            _gaq.push(['_trackEvent', 'Bild Navigation', position, newTitle]);
        }
    });

    myJS.resize();

    $('a.external').on('click', function(){
        _gaq.push(['_trackEvent', 'External Link', this.href, 'Externe Seite']);
    });
    $('a.intern').on('click', function(){
        _gaq.push(['_trackEvent', 'Internal Link', this.href, 'Interne Seite']);
    });
    $('a.logo').on('click', function(){
        _gaq.push(['_trackEvent', 'Internal Link', 'Home', 'Interne Seite']);
    });

    $('#next').on('click', mySwipe.next);

    $('#prev').on('click', mySwipe.prev);

    $('a.full').on('click', function (e) {
        
        e.preventDefault();
        if ($('body').hasClass('fullscreen')) {
            myJS.cancelFullscreen(document.documentElement);
            $('body').removeClass('fullscreen');
        } else {
            myJS.launchFullScreen(document.documentElement);
            $('body').addClass('fullscreen');
            _gaq.push(['_trackEvent', 'Fullscreen',  document.title, 'Fullscreen']);
        }
    });

    $(document.documentElement).keydown(function (e) {

        if (e.keyCode == 37) {
            // Left arrow 
            mySwipe.prev();
        } else if (e.keyCode == 39) {
            // Right arrow 
            mySwipe.next();
        }
    });

    $(window).on('resize', myJS.resize);

    if (document.documentElement.requestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullScreen ) {
            $('a.full').css('display','inline');
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $('a.full').css('display','none');
            }
    }

});

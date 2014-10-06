var myJS = (function() {

    var video;

    var buildVideoElement = function(videoFilename, parentElement) {
        $(parentElement).html('<div><video src="./videos/' + videoFilename + '.mp4" width="100%"></video>' +
                              '<p class="progress-bar-color"></p><p class="time"></p></div>');
        video = document.getElementsByTagName('video')[0];
        _this.resize();

    };

    var togglePlay = function() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    };

    var onTimeChange = function(event){

        var percentage = Math.floor((100 / video.duration) * video.currentTime);
        $('p.progress-bar-color').css('width', percentage + '%');
    };

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

        window.setTimeout(function(){
            var slideHeight = $(video).parent().height(),
                videoHeight = $(video).height(),
                videoMargin = (slideHeight - videoHeight) / 2;
            $(video).css('margin-top', videoMargin);
        }, 200);
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

    _this.playVideo = function () {
        var videoFilename = this.getAttribute('data-video');
        var parentElement = this.parentNode;
        var originalContent = $(this).detach();

        buildVideoElement(videoFilename, parentElement);
        
        $(video).on('timeupdate', onTimeChange);
        video.play();
        $(video).click(togglePlay);
        $(video).on('ended', function(){
            $(parentElement).html(originalContent);
            $(parentElement).find('img').attr('src','./photos/' + videoFilename + '.jpg');
        });
    };

    return _this;
})();


// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-46841984-1']);
// _gaq.push(['_trackPageview']);

// (function() {
//     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();

$(document).ready(function () {

    window.mySwipe = new Swipe(document.getElementById('slider'), {
        callback: function () {
            myJS.markCurrentPhoto();
            var newTitle = $('div.photo.current img').attr('alt');
            var position = mySwipe.getPos();
            document.title = "Michel Ickler - " + newTitle;
            //_gaq.push(['_trackEvent', 'Bild Navigation', position, newTitle]);
        }
    });

    myJS.resize();

    $('a.external').on('click', function(){
        //_gaq.push(['_trackEvent', 'External Link', this.href, 'Externe Seite']);
    });
    $('a.intern').on('click', function(){
        //_gaq.push(['_trackEvent', 'Internal Link', this.href, 'Interne Seite']);
    });
    $('a.logo').on('click', function(){
        //_gaq.push(['_trackEvent', 'Internal Link', 'Home', 'Interne Seite']);
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
            //_gaq.push(['_trackEvent', 'Fullscreen',  document.title, 'Fullscreen']);
        }
    });

    $('div.video img').on('click', myJS.playVideo);

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

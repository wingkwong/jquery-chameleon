/**
 * 
 *   _____ _    _          __  __ ______ _      ______ ____  _   _ 
 *  / ____| |  | |   /\   |  \/  |  ____| |    |  ____/ __ \| \ | |
 * | |    | |__| |  /  \  | \  / | |__  | |    | |__ | |  | |  \| |
 * | |    |  __  | / /\ \ | |\/| |  __| | |    |  __|| |  | | . ` |
 * | |____| |  | |/ ____ \| |  | | |____| |____| |___| |__| | |\  |
 *  \_____|_|  |_/_/    \_\_|  |_|______|______|______\____/|_| \_|
 *                                                                 
 *                                                                 
 * chameleon.js - Sychronizing slides with JWPlayer Video
 * @author Wing Kam Wong - wingkwong.code@gmail.com
 * @version - 1.0.0
 */
;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    var chameleon = 'chameleon';

    function Chameleon(element, o) {
        var el = element;
        var $el = $(element);

        o = $.extend({}, $.fn[chameleon].defaults, o);

        var $chameleon = $('.chameleon'),
            $this = $(this),
            $videoContainer = '<div class="video-container"><div id="jwplayer"></div></div>',
            $slideContainer = '<div class="slide-container"><img/></div>',
            $downloadContainer = '<div class="download-container"></div>',
            $carouselContainer = '<div class="carousel-container"></div>',
            $previewSlideContainer = '<div class="preview-slide-container"></div>',
            $carouselItem = '<div class="carousel-item"></div>',
            $previewImage = '<div class="thumbnail-container"><div class="slide-image"><img/></div><div class="slide-number"></div></div>',
            $carouselControl = '<a class="carousel-control prev">&lt;</a><a class="carousel-control next">&gt;</a>',
            chameleonContext = {},
            jwPlayerInst = {},
            maxImgInARow = 5;

        function _initChameleon() {
            if ($.isEmptyObject(o.chameleonContext)){
                throw new Error("Chameleon chameleonContext hasn't been defined.");
            }

            $chameleon.append($videoContainer).append($slideContainer).append($downloadContainer).append($carouselContainer);

            $chameleon.css("width", o.width).css("height", o.height);

            if (typeof o.chameleonContext === "object") {
                $this.chameleonContext = o.chameleonContext;
                _initContextValidator();
            }

            if (typeof o.chameleonContext === "string") {
                var regex = /(?:\.([^.]+))?$/;

                if (regex.exec(o.chameleonContext)[1] == "json") {
                    $.getJSON(o.chameleonContext, function(data) {
                        $this.chameleonContext = data;
                    }).done(function() {
                        _initContextValidator();
                    });
                } else {
                    throw new Error("JSON file required.");
                }
            }
        }

        function _initContextValidator(){
            if(typeof $this.chameleonContext.jwplayerKey === "undefined"){
                throw new Error("jwplayer key hasn't been defined in chameleonContext.");
            }

            if(typeof $this.chameleonContext.jwplayerSetup === "undefined"){
                throw new Error("jwplayer setup object hasn't been defined in chameleonContext.");
            }

            if(typeof $this.chameleonContext.slides === "undefined" || typeof $this.chameleonContext.slides != "object"){
                throw new Error("slides hasn't been defined in chameleonContext.");
            }

             if($this.chameleonContext.slides.length == 0){
                throw new Error("No slide hasn't been defined in chameleonContext.");
            }

            _buildHabitat();
        }

        function _buildHabitat() {

            _initJWPlayer();

            // Slide Container
            _setSlide(0);

            // Slides Carousel
            $chameleon.find('.carousel-container').append($previewSlideContainer).append($carouselControl);

            for (var i = 1; i <= $this.chameleonContext.slides.length; i++) {
                var $cItem = $($carouselItem).append($previewImage);
                $cItem.find('.slide-image').attr('data-index', i);
                $cItem.find('.slide-image img').attr('src', $this.chameleonContext.slides[i - 1].img);
                $cItem.find('.slide-image img').attr('title', $this.chameleonContext.slides[i - 1].title);
                $cItem.find('.slide-image img').attr('alt', $this.chameleonContext.slides[i - 1].alt);
                $cItem.find('.slide-number').html((i) + '/' + $this.chameleonContext.slides.length);
                $chameleon.find('.preview-slide-container').append($cItem);
            }

            $chameleon.find('.carousel-item:first').addClass("active");

            if ($this.chameleonContext.slides.length > o.numOfCarouselSlide) {
                $chameleon.find('.carousel-item').each(function() {
                    var itemToClone = $(this);
                    for (var i = 1; i < o.numOfCarouselSlide; i++) {
                        itemToClone = itemToClone.next();
                        if (!itemToClone.length) {
                            itemToClone = $(this).siblings(':first');
                        }
                        itemToClone.children(':first-child').clone()
                            .addClass("js-chameleon-" + (i))
                            .appendTo($(this));
                    }
                });

                var carouselInnerWidth = $chameleon.find('.carousel-item.active').width();
                var imageWidth = $chameleon.find('.carousel-item.active .thumbnail-container:first').width();
                $this.maxImgInARow = Math.floor(carouselInnerWidth / imageWidth);

                if ((o.numOfCarouselSlide > $this.maxImgInARow) && $this.maxImgInARow > 5) {
                    $chameleon.find('.carousel-item .js-chameleon-3').addClass("current-slide");
                } else {
                    var total = $chameleon.find('.carousel-item.active .thumbnail-container').length;
                    if (Math.floor(total / 2) >= 1) {
                        var i = $chameleon.find('.carousel-item.active .thumbnail-container:nth-child( ' + Math.floor(total / 2) + ') .slide-image').attr("data-index");
                        $chameleon.find('.carousel-item .js-chameleon-' + i + '').addClass("current-slide");
                    } else {
                        $chameleon.find('.carousel-control').remove();
                        $chameleon.find('.carousel-item .thumbnail-container').addClass("current-slide");
                    }
                }

                $chameleon.find('.current-slide img').css("width", "120px");

                _updateSlideCarouel(0);

            } else {
                $chameleon.find('.carousel-control').remove();
                $chameleon.find('.carousel-item').addClass("active");
            }

            // Download Container
            if(!$.isEmptyObject($this.chameleonContext.download)){

                if(typeof $this.chameleonContext.download.slides === "undefined" 
                    && typeof $this.chameleonContext.download.videos === "undefined" 
                    && typeof $this.chameleonContext.download.transcript === "undefined" 
                ){
                    $chameleon.find('.download-container').remove();
                }

                if(typeof $this.chameleonContext.download.slides != "undefined" 
                    && typeof $this.chameleonContext.download.slides === "object"){
                  
                    if(typeof $this.chameleonContext.download.slides.url != "undefined" 
                        && typeof $this.chameleonContext.download.slides.url === "string" ){
                        $chameleon.find('.download-container').append('<a class="download-btn download-slides" target="_blank">Download slides</a>');
                        $chameleon.find('.download-slides').attr("href", $this.chameleonContext.download.slides.url);
                    }

                    if($chameleon.find('.download-slides').length > 0 
                        && typeof $this.chameleonContext.download.slides.title != "undefined" 
                        && typeof $this.chameleonContext.download.slides.title === "string" ){
                        $chameleon.find('.download-slides').html($this.chameleonContext.download.slides.title);
                        $chameleon.find('.download-slides').attr("title", $this.chameleonContext.download.slides.title);
                    }


                }

                if(typeof $this.chameleonContext.download.video != "undefined" 
                    && typeof $this.chameleonContext.download.video === "object"){
                    if(typeof $this.chameleonContext.download.video.url != "undefined" 
                        && typeof $this.chameleonContext.download.video.url === "string" ){
                        $chameleon.find('.download-container').append('<a class="download-btn download-video" target="_blank">Download video</a>');
                        $chameleon.find('.download-video').attr("href", $this.chameleonContext.download.video.url);
                    }

                    if($chameleon.find('.download-video').length > 0 
                        && typeof $this.chameleonContext.download.video.title != "undefined" 
                        && typeof $this.chameleonContext.download.video.title === "string" ){
                        $chameleon.find('.download-video').html($this.chameleonContext.download.video.title);
                        $chameleon.find('.download-video').attr("title", $this.chameleonContext.download.video.title);
                    }
                }

                if(typeof $this.chameleonContext.download.transcript != "undefined" 
                    && typeof $this.chameleonContext.download.transcript === "object"){
                    if(typeof $this.chameleonContext.download.transcript.url != "undefined" 
                        && typeof $this.chameleonContext.download.transcript.url === "string" ){
                        $chameleon.find('.download-container').append('<a class="download-btn download-transcript" target="_blank">Download transcript</a>');
                        $chameleon.find('.download-transcript').attr("href", $this.chameleonContext.download.transcript.url);
                    }

                    if($chameleon.find('.download-transcript').length > 0 
                        && typeof $this.chameleonContext.download.transcript.title != "undefined" 
                        && typeof $this.chameleonContext.download.transcript.title === "string" ){
                        $chameleon.find('.download-transcript').html($this.chameleonContext.download.transcript.title);
                        $chameleon.find('.download-transcript').attr("title", $this.chameleonContext.download.transcript.title);
                    }
                }
            }

            //

            _registerClickEvents();
        }

        function _initJWPlayer(){
            jwplayer.key = $this.chameleonContext.jwplayerKey;

            $this.jwPlayerInst = jwplayer("jwplayer").setup( $this.chameleonContext.jwplayerSetup);

            $this.jwPlayerInst.onReady(function() {
                $chameleon.find('.video-container #jwplayer').css("width", "100%").css("height", "100%");

                var $videoContainer = $chameleon.find('.video-container');
                var $slideContainer = $chameleon.find('.slide-container');

                if($videoContainer.height() > $slideContainer.height()){
                    $slideContainer.css("margin-top", ($videoContainer.height()-$slideContainer.height())/2);
                }else{
                    $videoContainer.css("margin-top", ($slideContainer.height()-$videoContainer.height())/2);
                }

            });

            $this.jwPlayerInst.onTime(function() {
                var time = $this.jwPlayerInst.getPosition();
                var duration = $this.jwPlayerInst.getDuration();
                _slideCarouselHandler(time, duration);
            });

            $this.jwPlayerInst.onComplete(function() {
                _setSlide(0);
                _updateSlideCarouel(0);
            });
        }

        function _registerClickEvents() {
            // Move to the target timeslot when the slide preview is clicked
            $chameleon.find('.slide-image').click(function() {
                var id = $(this).attr("data-index");
                $this.jwPlayerInst.seek(_parseStrTime($this.chameleonContext.slides[id - 1].time));
            });

            $chameleon.find('.carousel-control.prev').click(function() {
                var id = $('.active .current-slide .slide-image').attr("data-index");
                id = parseInt(id) - 1;
                if (id == 0) {
                    id = $this.chameleonContext.slides.length;
                }

                $this.jwPlayerInst.seek(_parseStrTime($this.chameleonContext.slides[id - 1].time));
            });

            $chameleon.find('.carousel-control.next').click(function() {
                var id = $chameleon.find('.active .current-slide .slide-image').attr("data-index");
                if (id == $this.chameleonContext.slides.length) {
                    id = 0;
                }

                $this.jwPlayerInst.seek(_parseStrTime($this.chameleonContext.slides[id].time));
            });
        }

        function _updateSlideCarouel(index) {
            var index = parseInt(index) + 1;
            var target = $('.current-slide .slide-image[data-index="' + index + '"]').parent().parent();
            $('.carousel-item.active').removeClass("active");
            target.addClass("active");
        }

        function _parseStrTime(time) {
            // parse time : '00:00:15'
            var hms = time.split(':');
            return (parseInt(hms[0] * 60 * 60) + parseInt(hms[1] * 60) + parseInt(hms[2]));
        }

        function _slideCarouselHandler(time, duration) {
            if (time >= _parseStrTime($this.chameleonContext.slides[$this.chameleonContext.slides.length - 1].time)) {
                if ($this.chameleonContext.slides.length > o.numOfCarouselSlide) {
                    _updateSlideCarouel($this.chameleonContext.slides.length - 1);
                }
                 _setSlide($this.chameleonContext.slides.length - 1);
            } else {
                for (var i = 0, j = 1; i < $this.chameleonContext.slides.length; i++, j++) {
                    if (time >= _parseStrTime($this.chameleonContext.slides[i].time) && time < _parseStrTime($this.chameleonContext.slides[j].time)) {
                        if ($this.chameleonContext.slides.length > o.numOfCarouselSlide) {
                            _updateSlideCarouel(i);
                        }
                         _setSlide(i);
                    }
                }
            }
        }

        function _setSlide(index){
            $chameleon.find('.slide-container img').attr('src', $this.chameleonContext.slides[index].img);
            $chameleon.find('.slide-container img').attr('title', $this.chameleonContext.slides[index].title);
            $chameleon.find('.slide-container img').attr('alt', $this.chameleonContext.slides[index].alt);
        }

        function hook(hookName) {
            if (o[hookName] !== undefined) {
                o[hookName].call(el);
            }
        }

        //-----------------CHAMLEON--------------------//

        _initChameleon();

        //-----------------CHAMLEON--------------------//
    }

    $.fn[chameleon] = function(o) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + chameleon) && typeof $.data(this, 'plugin_' + chameleon)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + chameleon)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + chameleon);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof o === "object" || !o) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + chameleon)) {
                    $.data(this, 'plugin_' + chameleon, new Chameleon(this, o));
                }
            });
        }
    };

    $.fn[chameleon].defaults = {
        width: '1024px',            // width of chameleon container
        height: '300px',            // height of chameleon container
        chameleonContext: {},              // slides JSON file / object 
        numOfCarouselSlide: 5      // number of slides showing in carousel
    };
}));
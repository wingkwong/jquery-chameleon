/**
 * chameleon.js - Sychronizing JWPlayer videos and slides
 * @author Wing Kam Wong - wingkwong.code@gmail.com
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
            $videoWrap = '<div class="video-wrap"><div id="jwplayer"></div></div>',
            $slideWrap = '<div class="slide-wrap"><img/></div>',
            $previewWrap = '<div class="preview-wrap"></div>',
            $carouselWrap = '<div class="carousel-wrap"></div>',
            $carouselItem = '<div class="carousel-item"></div>',
            $previewImage = '<div class="iWrap"><div class="preview-image"><img/></div><div class="slide-number"></div></div>',
            $carouselControl = '<a class="prev sync carousel-control">&lt;</a><a class="next sync carousel-control">&gt;</a>',
            slides = {},
            jwPlayerInst = {},
            maxImgInARow = 5;

        function _init() {
            $chameleon.append($videoWrap).append($slideWrap).append($previewWrap);

            $chameleon.css("width", o.width).css("height", o.height);

            if (typeof o.slidePool === "object") {
                if (typeof o.slidePool.slides != "undefined" && o.slidePool.slides.length > 0) {
                    $this.slides = o.slidePool.slides;
                    _buildHabitat();
                } else {
                    return;
                }
            }

            if (typeof o.slidePool === "string") {
                var regex = /(?:\.([^.]+))?$/;

                if (regex.exec(o.slidePool)[1] == "json") {
                    $.getJSON(o.slidePool, function(data) {
                        $this.slides = data.slides;
                    }).done(function() {
                        _buildHabitat();
                    });
                } else {
                    return;
                }
            }
        }

        function _buildHabitat() {
            // Slide Wrap
            $chameleon.find('.slide-wrap img').attr('src', $this.slides[0].img);

            // Carousel for previewing slides
            $chameleon.find('.preview-wrap').append($carouselWrap).append($carouselControl);

            for (var i = 1; i <= $this.slides.length; i++) {
                var $cItem = $($carouselItem).append($previewImage);
                $cItem.find('.preview-image').attr('data-index', i);
                $cItem.find('.preview-image img').attr('src', $this.slides[i - 1].img);
                $cItem.find('.slide-number').html((i) + '/' + $this.slides.length);
                $chameleon.find('.carousel-wrap').append($cItem);
            }

            $chameleon.find('.carousel-item:first').addClass("active");

            if ($this.slides.length > o.numOfCarouselSlide) {
                $chameleon.find('.carousel-item').each(function() {
                    var itemToClone = $(this);
                    for (var i = 1; i < o.numOfCarouselSlide; i++) {
                        itemToClone = itemToClone.next();
                        if (!itemToClone.length) {
                            itemToClone = $(this).siblings(':first');
                        }
                        itemToClone.children(':first-child').clone()
                            .addClass("cloneditem-" + (i))
                            .appendTo($(this));
                    }
                });

                var carouselInnerWidth = $chameleon.find('.carousel-item.active').width();
                var imageWidth = $chameleon.find('.carousel-item.active .iWrap:first').width();
                $this.maxImgInARow = Math.floor(carouselInnerWidth / imageWidth);

                if ((o.numOfCarouselSlide > $this.maxImgInARow) && $this.maxImgInARow > 5) {
                    $chameleon.find('.carousel-item .cloneditem-3').addClass("chameleon-main");
                } else {
                    var total = $chameleon.find('.carousel-item.active .iWrap').length;
                    if (Math.floor(total / 2) >= 1) {
                        var i = $chameleon.find('.carousel-item.active .iWrap:nth-child( ' + Math.floor(total / 2) + ') .preview-image').attr("data-index");
                        $chameleon.find('.carousel-item .cloneditem-' + i + '').addClass("chameleon-main");
                    } else {
                        $chameleon.find('.carousel-control').remove();
                        $chameleon.find('.carousel-item .iWrap').addClass("chameleon-main");
                    }
                }

                _updateSlideOrder(0);

            } else {
                $chameleon.find('.carousel-control').remove();
                $chameleon.find('.carousel-item').addClass("active");
            }

            _feedChameleon();
        }

        function _feedChameleon() {
            // Move to the target timeslot when the slide preview is clicked
            $chameleon.find('.preview-image').click(function() {
                var id = $(this).attr("data-index");
                $this.jwPlayerInst.seek(_parseStrTime($this.slides[id - 1].time));
            });

            $chameleon.find('.carousel-control.prev').click(function() {
                var id = $('.active .chameleon-main .preview-image').attr("data-index");
                id = parseInt(id) - 1;
                if (id == 0) {
                    id = $this.slides.length;
                }

                $this.jwPlayerInst.seek(_parseStrTime($this.slides[id - 1].time));
            });

            $chameleon.find('.carousel-control.next').click(function() {
                var id = $chameleon.find('.active .chameleon-main .preview-image').attr("data-index");
                if (id == $this.slides.length) {
                    id = 0;
                }

                $this.jwPlayerInst.seek(_parseStrTime($this.slides[id].time));
            });

        }

        function _updateSlideOrder(index) {
            var index = parseInt(index) + 1;
            var target = $('.chameleon-main .preview-image[data-index="' + index + '"]').parent().parent();
            $('.carousel-item.active').removeClass("active");
            target.addClass("active");
        }

        function _parseStrTime(time) {
            // parse time : '00:00:15'
            var hms = time.split(':');
            return (parseInt(hms[0] * 60 * 60) + parseInt(hms[1] * 60) + parseInt(hms[2]));
        }

        function _showSlideHandler(time, duration) {
            if (time >= _parseStrTime($this.slides[$this.slides.length - 1].time)) {
                if ($this.slides.length > o.numOfCarouselSlide) {
                    _updateSlideOrder($this.slides.length - 1);
                }
                $chameleon.find('.slide-wrap').html('<img src="' + $this.slides[$this.slides.length - 1].img + '" data-index="' + $this.slides.length + '"/>');
            } else {
                for (var i = 0, j = 1; i < $this.slides.length; i++, j++) {
                    if (time >= _parseStrTime($this.slides[i].time) && time < _parseStrTime($this.slides[j].time)) {
                        if ($this.slides.length > o.numOfCarouselSlide) {
                            _updateSlideOrder(i);
                        }
                        $chameleon.find('.slide-wrap').html('<img src="' + $this.slides[i].img + '" data-index="' + i + '"/>');
                    }
                }
            }
        }

        // public ------------------------
        function setJWPlayerInst(jwPlayerInst) {
            $this.jwPlayerInst = jwPlayerInst;

            $this.jwPlayerInst.onReady(function() {
                $('.video-wrap #jwplayer').css("width", "100%").css("height", "100%");
            });

            $this.jwPlayerInst.onTime(function() {
                var time = $this.jwPlayerInst.getPosition();
                var duration = $this.jwPlayerInst.getDuration();
                _showSlideHandler(time, duration);
            });

            $this.jwPlayerInst.onComplete(function() {
                $chameleon.find('.slide-wrap').html('<img src="' + $this.slides[0].img + '"/>');
                _updateSlideOrder(0);
            });
        }

        function hook(hookName) {
            if (o[hookName] !== undefined) {
                o[hookName].call(el);
            }
        }

        //-----------------CHAMLEON--------------------//

        _init();

        return {
            setJWPlayerInst: setJWPlayerInst
        };

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
        slidePool: {},              // slides JSON file / object 
        numOfCarouselSlide: 6       // number of slides showing in carousel
    };
}));
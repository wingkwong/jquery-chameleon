/**
 * chameleon.js - Video with images synced
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
            jwplayerInstance = {};

        function _updateImgOrder(index) {
            console.log("_updateImgOrder");

            var index = parseInt(index) + 1;
            var target = $('.cloneditem-2 .preview-image[data-index="' + index + '"]').parent().parent();
            $('.carousel-item.active').removeClass("active");
            target.addClass("active");
        }

        function _parseTime(time) {
            // parse time of type string: '00:00:15'
            var hms = time.split(':');
            return (parseInt(hms[0] * 60 * 60) + parseInt(hms[1] * 60) + parseInt(hms[2]));
        }

        // public ------------------------

        function setJWplayerInstance(jwPlayerInst) {
            jwPlayerInst.onReady(function() {
                //TODO:
            });

            jwPlayerInst.onComplete(function() {
                //TODO:
            });

            // Move to the target timeslot when the preview image is clicked
            $chameleon.find('.preview-image').click(function() {
                var id = $(this).attr("data-index");
                jwPlayerInst.seek(_parseTime(slides[id - 1].time));
            });


            $chameleon.find('.carousel-control').click(function() {
                var id = $('.active .cloneditem-2 .preview-image').attr("data-index");

                if ($(this).hasClass("prev")) {
                    if ($chameleon.find('.carousel-item.active').is(':first-child')) {
                        $chameleon.find('.carousel-item.active').removeClass("active").parent()
                            .find('.carousel-item:last-child').addClass("active");
                    } else {
                        $chameleon.find('.carousel-item.active').removeClass("active")
                            .prev().addClass("active");
                    }


                    if (parseInt(id) - 1 == 0) {
                        id = slides.length;
                    }

                    jwPlayerInst.seek(_parseTime(slides[id - 1].time));

                } else if ($(this).hasClass("next")) {
                    if ($chameleon.find('.carousel-item.active').is(':last-child')) {
                        $chameleon.find('.carousel-item.active').removeClass("active").parent()
                            .find('.carousel-item:first-child').addClass("active");
                    } else {
                        $chameleon.find('.carousel-item.active').removeClass("active")
                            .next().addClass("active");
                    }

                    if (id == slides.length) {
                        id = 0;
                    }

                    jwPlayerInst.seek(_parseTime(slides[id].time));
                } else {
                    return;
                }
            });

        }

        function hook(hookName) {
            if (o[hookName] !== undefined) {
                o[hookName].call(el);
            }
        }



        //-----------------CHAMLEON--------------------//

        $chameleon.append($videoWrap);

        var slides;

        if (typeof o.slidePool === "object") {
            if (typeof o.slidePool.slides != "undefined" && o.slidePool.slides.length > 0) {
                slides = o.slidePool.slides
            } else {
                return;
            }
        }

        if (typeof o.slidePool === "string") {
            var regex = /(?:\.([^.]+))?$/;
            if (regex.exec(o.slidePool)[1] == "json") {
                $.getJSON(o.slidePool, function(data) {
                    console.log(data);
                    //TODO: test this
                    slides = data;
                });
            } else {
                return;
            }
        }


        $chameleon.append($slideWrap).append($previewWrap);

        // Slide Wrap
        $chameleon.find('.slide-wrap img').attr('src', slides[0].img);

        // Preview Carousel
        $chameleon.find('.preview-wrap').append($carouselWrap).append($carouselControl);

        for (var i = 1; i <= slides.length; i++) {
            var $cItem = $($carouselItem).append($previewImage);
            $cItem.find('.preview-image').attr('data-index', i);
            $cItem.find('.preview-image img').attr('src', slides[i - 1].img);
            $cItem.find('.slide-number').html((i) + '/' + slides.length);
            $chameleon.find('.carousel-wrap').append($cItem);
        }

        $chameleon.find('.carousel-item:first').addClass("active");

        if (slides.length > o.carouselSlide) {
            $('.carousel-item').each(function() {
                var itemToClone = $(this);
                for (var i = 1; i < o.carouselSlide; i++) {
                    itemToClone = itemToClone.next();
                    if (!itemToClone.length) {
                        itemToClone = $(this).siblings(':first');
                    }
                    itemToClone.children(':first-child').clone()
                        .addClass("cloneditem-" + (i))
                        .appendTo($(this));
                }
            });
            _updateImgOrder(0);
        } else {
            $chameleon.find('.carousel-item').addClass("active");
        }



        console.log($this.jwplayerInstance);




        return {
            setJWplayerInstance: setJWplayerInstance
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
        slidePool: {}, // slides JSON object
        carouselSlide: 5, // number of slides showing in carousel
        downloadVideo: false, // download video button
        downloadTranscript: false, // download transcript button
    };
}));
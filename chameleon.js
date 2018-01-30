/**
 * chameleon.js - Video with images synced
 * @author Wing Kam Wong - wingkwong.code@gmail.com
 */
;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
	  $.fn.chameleon = function(options) {
	  	console.log("chameleon started");
		return this.each(function() {
			var o = $.extend({}, $.fn.chameleon.defaults, options),
			$this = $(this),
			$videoWrap = '<div class="video-wrap"><div id="jwplayer"></div></div>',
			$slideWrap = '<div class="slide-wrap"><img/></div>',
			$previewWrap = '<div class="preview-wrap"></div>',
			$carouselWrap = '<div class="carousel-wrap"></div>',
			$carouselItem = '<div class="carousel-item"></div>',
			$previewImage = '<div class="preview-image"><img/></div><div class="slide-number"></div>',
			$carouselControl = '<a class="left sync carousel-control">&lt;</a><a class="right sync carousel-control">&gt;</a>'

			//-- private methods
			_clickHandler = function(){

			},
			_init = function(){
				
			},
			_init = function(){
				
			},
			//-- public methods
			methods = {
				 method1: function() {

				 },
				 method2: function(){
				 	
				 }
			};

			//-----------------CHAMLEON--------------------

			$this.append($videoWrap);

			var slides;

			if(typeof o.slidePool === "object"){
				if(typeof o.slidePool.slides != "undefined" && o.slidePool.slides.length > 0){
					slides = o.slidePool.slides
				}else{
					return;
				}
			}

			if(typeof o.slidePool === "string"){
				var regex = /(?:\.([^.]+))?$/;
				if(regex.exec(o.slidePool)[1] == "json"){
					$.getJSON(o.slidePool, function(data){
						console.log(data);
						//TODO: test this
						slides = data;
					});
				}else{
					return;
				}
			}

			$this.append($slideWrap).append($previewWrap);

			// Slide Wrap
			$this.find('.slide-wrap img').attr('src', slides[0].img);

			// Preview Carousel
			$this.find('.preview-wrap').append($carouselWrap).append($carouselControl);

			for(var i=0; i<o.slidePool.slides.length; i++){
				var $cItem = $($carouselItem).append($previewImage);
				$cItem.find('.preview-image').attr('data-index', i);
				$cItem.find('.preview-image img').attr('src', slides[i].img);
				$cItem.find('.slide-number').html((i+1) + '/' + slides.length);
				$this.find('.carousel-wrap').append($cItem);
			}

			//-----------------CHAMLEON--------------------
		});
	  };
	  
	  // plugin defaults
	  $.fn.chameleon.defaults = {
	  	// slides JSON object
		slidePool: {},
		// download video button
		downloadVideo: false,
		// download transcript button
		downloadTranscript: false

	  };
}));
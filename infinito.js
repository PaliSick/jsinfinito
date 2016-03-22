/**
 * jquery.clever-infinite-scroll.js
 * Working with jQuery 2.1.4

 Modify By Pablo Diaz to make work with json data. 

The difference between the original and this modification is,
that it allows to obtain the data type json,
reducing the size of the requested data to the server.

 And after in your js you can add the html. 
*/



(function(root, factory){
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		factory(require("jquery"));
	} else {
		factory(root.jQuery);
	}
})(this, function($) {
	"use strict";
	/**
	 * Elements it reffers. Each page must has those selectors.
	 * The structure must be same as article1.html
	 * #contentsWrapper, .content, #next
	*/
	$.fn.cleverInfiniteScroll = function(options) {
		/**
		 * Settings
		*/
		var windowHeight = (typeof window.outerHeight !== "undefined") ? Math.max(window.outerHeight, $(window).height()) : $(window).height(),
		defaults = {
			contentsWrapperSelector: "#contentsWrapper",
			contentSelector: ".container-tarj-product-destc",
			nextSelector: "#next",
			loadImage: "",
			offset: windowHeight,
		}, settings = $.extend(defaults, options);

		/**
		 * Private methods
		*/
		var generateHiddenSpans = function(_title, _path) {
			return "<span class='hidden-title' style='display:none'>" + _title + "</span><span class='hidden-url' style='display:none'>" + _path + "</span>";
		},
		setTitleAndHistory = function(_title, _path) {
			// Set history
			history.pushState(null, _title, _path);
			// Set title
			$("title").html(_title);
		},
		changeTitleAndURL = function(_value) {
			// value is an element of a content user is seeing
			// Get title and path of the article page from hidden span elements
			var title = $(_value).children(".hidden-title:first").text(),
				path = $(_value).children(".hidden-url:first").text();
			if($("title").text() !== title) {
				// If it has changed
				$(settings.contentSelector).removeClass("active");
				$(_value).addClass("active");
				setTitleAndHistory(title, path);
			}
		};

		/**
		 * Initialize
		*/
		// Get current page's title and URL.
		var title = $("title").text(),
			path = $(location).attr("href"),
			documentHeight = $(document).height(),
			threshold = settings.offset,
			$contents = $(settings.contentSelector), seguir=true;
		// Set hidden span elements and history
		$(settings.contentSelector + ":last").append(generateHiddenSpans(title, path));
		$(settings.contentSelector).addClass("active");
		setTitleAndHistory(title, path);

		/**
		 * scroll
		*/
		var lastScroll = 0, currentScroll;
		$(window).scroll(function() {
			// Detect where you are
			window.clearTimeout($.data("this", "scrollTimer"));
			$.data(this, "scrollTimer", window.setTimeout(function() {
				// Get current scroll position
				currentScroll = $(window).scrollTop();
				
				// Detect whether it's scrolling up or down by comparing current scroll location and last scroll location
				if(currentScroll > lastScroll) {
					// If it's scrolling down
					$contents.each(function(key, value) {
						if($(value).offset().top + $(value).height() > currentScroll) {
							// Change title and URL
							changeTitleAndURL(value);
							// Quit each loop
							return false;
						}
					});
				} else if(currentScroll < lastScroll) {
					// If it's scrolling up
					$contents.each(function(key, value) {
						if($(value).offset().top + $(value).height() - windowHeight / 2 > currentScroll) {
							// Change title and URL
							changeTitleAndURL(value);
							// Quit each loop
							return false;
						}
					});
				} 
				// Renew last scroll position
				lastScroll = currentScroll;
			}, 200));
			var $url = [$(settings.nextSelector).attr("href")];
			if($(window).scrollTop() + windowHeight + threshold >= documentHeight) {

				
				$(settings.nextSelector).remove();
				if($url[0] !== undefined) {
					// If the page has link, call ajax
					if(settings.loadImage !== "") {
						$(settings.contentsWrapperSelector).append("<img src='" + settings.loadImage + "' id='cis-load-img'>");
					}
					page++;
			
					var Uajax='http://ejemplo.eu/productos/ajax/page/'+page;
					

					
		                $.get(Uajax, function(data) {
		                	
		                	for(var i in data)
							{
								if(i==3){
								    var $html='<article class="col-sm-6 col-md-3 wrapper-tarj-product-destc tarj-product-destc-bottom">\
						              <div class="thumbnail"> <img src="http://ejemplo.com/'+data[i].img_name+'" alt="..." class="img-responsive">\
						                <div class="caption">\
						                  <p class="col-md-12">'+data[i].nombre+'</p>\
						                </div>\
						              </div>\
						            </article>';
								}else{
								    var $html='<article class="col-sm-6 col-md-3 wrapper-tarj-product-destc tarj-product-destc">\
						              <div class="thumbnail"> <img src="http://ejemplo.com/'+data[i].img_name+'" alt="..." class="img-responsive">\
						                <div class="caption">\
						                  <p class="col-md-12">'+data[i].nombre+'</p>\
						                </div>\
						              </div>\
						            </article>';
						        }
					            $(settings.contentSelector).append($html);
							     
							}

		                	
		                   	if(data.texto!=false){
		                    	$(settings.contentsWrapperSelector).append('<a href="next"  id="next">next</a>');
		                   	}	                	
		                    
		                    documentHeight = $(document).height();
		                    
							$("#cis-load-img").remove();
		                 
		                }, 'json');
		            


				}
			}
		}); //scroll

		return (this);
	}; //$.fn.cleverInfiniteScroll
});


/*llamado a la función */

$('#contentsWrapper').cleverInfiniteScroll({
  contentsWrapperSelector: '#contentsWrapper',
  contentSelector: '.container-tarj-product-destc',
  nextSelector: '#next',
  loadImage: 'ajax-loader.gif'
});


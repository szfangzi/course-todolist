(function(window) {

	var jQuery = function( selector ) {
		
		return new jQuery.fn.init( selector );
	};

	jQuery.fn = jQuery.prototype = {
	
		constructor: jQuery,
		length: 0
	};

	var init = jQuery.fn.init = function( selector ) {
		

		return jQuery.makeArray( selector, this );
	};


	init.prototype = jQuery.fn;

	window.jQuery = window.$ = jQuery;

})(window);
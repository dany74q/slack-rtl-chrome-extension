var RTL_CHARACTERS = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC';
var RTL_REGEX = new RegExp('^[^'+RTL_CHARACTERS+']*?['+RTL_CHARACTERS+']');

var isRTL = function(str) {           
	return RTL_REGEX.test(str);
};

var msgInputElement = $('#msg_input');

var rtlifyInput = (function(e) {
	if (isRTL($(this).val())) {
		$(this).css('direction', 'rtl').css('text-align', 'left');
	} else {
		$(this).css('direction', 'ltr');
	}
}).bind(msgInputElement);

// Minor timeout for when the paste event triggers before the text is available
msgInputElement.on('input keyup change propertychange paste', function() { setTimeout(rtlifyInput, 20); });

var rtlifyMessages = function () {
	$('.message_body').each(function(idx, msg) {
		if (isRTL($(msg).text())) {
			$(msg).css('direction', 'rtl').css('text-align', 'left');
		}
	});
};

$("#msgs_div").bind("DOMSubtreeModified", rtlifyMessages);

// It takes some time for previous entered text to load
setTimeout(function() {
	rtlifyMessages();
	msgInputElement.trigger('change');
}, 1000);
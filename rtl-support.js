var RTL_CHARACTERS = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC';
var RTL_REGEX = new RegExp('^[^'+RTL_CHARACTERS+']*?['+RTL_CHARACTERS+']');

var isRTL = function(str) {           
	return RTL_REGEX.test(str);
};

var msgInputElement = document.querySelector('#msg_input .ql-editor') || document.querySelector('#msg_input');

var rtlifyInput = (function(e) {
	if (isRTL(this.value || this.innerText)) {
		this.classList.add('slack-rtl');
	} else {
		this.classList.remove('slack-rtl');
	}
}).bind(msgInputElement);

// Minor timeout for when the paste event triggers before the text is available
var timeoutRtlifyFunc = function() { setTimeout(rtlifyInput, 20); };
msgInputElement.oninput = msgInputElement.onkeyup = msgInputElement.onpaste = msgInputElement.onchange = msgInputElement.onpropertychange = timeoutRtlifyFunc;

var rtlifyMessages = function () {
	var messages = document.getElementsByClassName('message_body');
	messages = Array.prototype.filter.call(messages, function(message) {
		return (!message.classList.contains('slack-rtl')) && (!message.classList.contains('slack-ltr'));
	});

	for (var i=0; i<messages.length; ++i) {
		var message = messages[i];
		message.classList.add(isRTL(message.innerText) ? 'slack-rtl' : 'slack-ltr');
	}
};

var scrollToBottom = function() {
	var scrollerDiv = document.getElementById("msgs_scroller_div");
	scrollerDiv.scrollTop = scrollerDiv.scrollHeight;
}

var target = document.getElementById('msgs_div');
var observer = new MutationObserver(function(mutations) {
 	mutations = mutations.filter(function(mutation) { 
 		return mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0
 				&& Array.prototype.filter.call(mutation.addedNodes, function(node) {
 					return node.classList && (node.classList.contains('message') || node.classList.contains('day_container'));
 				}).length > 0;
 	});

 	if (mutations.length > 0) {
 		rtlifyMessages();
 		setTimeout(function() {
	 		scrollToBottom();
 		}, 800);
 	} 
});
 
var config = { attributes: true, childList: true, characterData: true, subtree: true };
observer.observe(target, config);

var msgInputObserver = new MutationObserver(function(mutations) {
	mutations = mutations.filter(function(mutation) { 
		return (mutation.type === 'attributes' && mutation.attributeName !== 'class') || (mutation.type === 'characterData');
	})
	if (mutations.length > 0) {
		msgInputElement.onchange();
	}
});

// It takes some time for previous entered text to load
setTimeout(function() {
	rtlifyMessages();
	msgInputElement.onchange();
	msgInputObserver.observe(msgInputElement, { attributes: true, childList: true, characterData: true, subtree: true });
}, 1500);
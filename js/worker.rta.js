/*
 * @category JS Lib
 * @package Real-Time Application
 * @see jquery.rta.js
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
var request = {}, iteration = 1, DELAY = 3000;
var cEventSource = function() {    
    return (function() {    
    var _xhr = new XMLHttpRequest();
    _xhr.onreadystatechange = function() {
        if (_xhr.readyState === 4 && _xhr.status == 200 &&_xhr.responseText.length) {
            var data = JSON.parse(_xhr.responseText);
            self.postMessage(data);
            setTimeout(cEventSource, DELAY);
        }
    };
    _xhr.open("POST", request.eventSource, true);
    _xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    _xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    _xhr.send(request.query);
    iteration ++;
    })();
};
self.onmessage = function(event) {
    request = event.data;
    if (event.data.action == 'close') { return self.close(); }
    cEventSource();
};

/*
 * @category JS Lib
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */

(function( $ ) {

if (typeof $.jsa == "undefined") {
    throw "Attempt to extend $.JSA before it is loaded";
}

$.jsa.RealTimeWidgetAbstract = $.jsa.extend({
    name: 'RealTimeWidgetAbstract',
    init : function() {
       $.rta.subscribe(this, this.subscribeRta);
    }
}, $.jsa.WidgetAbstract);

$.rta = (function() {
    var _private = {
        queue : [],
        subscriber: [],
        getQuery : function() {
            return JSON.stringify(_private.queue);
        },
        subscribeListener : function(source, fn) {
           $(source).unbind('rta-message').bind('rta-message', fn);
        },
        isSourceValidate : function(source) {
             if (typeof source.name == 'undefined') {
                throw 'Not found name property of the listener';
             }
             if (typeof source.module == 'undefined') {
                throw 'Not found module property of the listener';
             }
        },
        enqueue : function(source) {
            if (_private.subscriber[source.name]) {
                return false;
            }
            _private.subscriber[source.name] = source;
            _private.queue.push({
                sourceName : source.name,
                module: source.module,
                param : null
            });
        }
    }
    return {
      subscribe : function(source, fn) {           
           _private.isSourceValidate(source);
           _private.enqueue(source);
           _private.subscribeListener(source, fn)
      },
      connect : function(eventSource) {
            var bridge = new $.rta.communicationBridge('worker');
            bridge.publish({
                query : _private.getQuery(),
                eventSource : eventSource
            });
            bridge.subscribe(function(e) {
                for (var sourceName in e.data) {
                    if (e.data[sourceName]) {
                        $(_private.subscriber[sourceName]).trigger('rta-message', e.data[sourceName]);
                    }
                }
            });          
      }
    };
}());

$.rta.communicationBridge = function(adapter) {
    var _private = {       
        communicationBridge : null,
        adapter : {
          'worker' : (function() {
              // The worker is encopsulated into worker.rta.js to show the experiment code
              // more explicitly. However you can keep worker code here. Find details in
              // the section Inline Workers at http://www.html5rocks.com/en/tutorials/workers/basics/
              var _adapter = new Worker('./js/worker.rta.js');
              return {
                  subscribe : function(callback) {
                    _adapter.addEventListener('message', callback, false);
                  },
                  publish : function(message) {
                     message.query = 'method=worker&queue=' + message.query;
                     _adapter.postMessage(message);
                  },
                  terminate : function() {
                     _adapter.postMessage({action: 'close'});
                  }
              }
          })(),
          'sse' : function() {
              // Here you can put the code of Server-Sent Events connector
          }
        }
    }    
    _private.communicationBridge = _private.adapter[adapter];
    // As browser window is closed, connection is closed as well
    $(window).unbind('unload').bind('unload', function() {
       _private.communicationBridge.terminate();
    });
    // Not really neccessary, but useful when experimenting - Esc closes connection
    $(window).unbind('keypress').bind('keypress', function(e) {
       if (e.keyCode == 27) {
           _private.communicationBridge.terminate();
       }
    });
    return {
        subscribe: function(callback) {
            _private.communicationBridge.subscribe(callback);
        },
        publish : function(message) {
            _private.communicationBridge.publish(message);
        }
    }
};

})( jQuery );
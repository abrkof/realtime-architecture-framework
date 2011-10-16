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
       $.rta.publish(this); // Checking in 
    },
    publishRta: function(message) {
        $.rta.publish(this, message);
    }
}, $.jsa.WidgetAbstract);

$.rta = (function() {
    var _private = {
        queue : [],
        subscriber: [],
        getQuery : function() {
            return JSON.stringify(_private.queue);
        }
    }
    return {
      subscribe : function(source, fn) {
           $(source).unbind('rta-message').bind('rta-message', fn);
      },
      publish : function(source, message) {
          if (typeof source.name == 'undefined') {
              throw 'Widget object must have name property';
          }
          if (typeof message == 'undefined') {
              message = [];
          }
          if (_private.subscriber[source.name]) {
              return false;
          }
          _private.subscriber[source.name] = source;
          return _private.queue.push($.extend({
              sourceName : source.name,
              module: source.module,
              param: null,
              frequency: 0,
              action: 'push'
          }, message));
          
         
      },
      connect : function(eventSource) {
            var machine = new $.rta.eventMachine('worker');
            machine.publish({
                query : _private.getQuery(),
                eventSource : eventSource
            });
            machine.subscribe(function(e) {
                for (var sourceName in e.data) {
                    if (e.data[sourceName]) {
                        $(_private.subscriber[sourceName]).trigger('rta-message', e.data[sourceName]);
                    }
                }
            });          
      }
    };
}());

$.rta.eventMachine = function(adapter) {
    var _private = {       
        eventMachine : null,
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
    _private.eventMachine = _private.adapter[adapter];
    // As browser window is closed, connection is closed as well
    $(window).unbind('unload').bind('unload', function() {
       _private.eventMachine.terminate();
    });
    // Not really neccessary, but useful when experimenting - Esc closes connection
    $(window).unbind('keypress').bind('keypress', function(e) {
       if (e.keyCode == 27) {
           _private.eventMachine.terminate();
       }
    });
    return {
        subscribe: function(callback) {
            _private.eventMachine.subscribe(callback);
        },
        publish : function(message) {
            _private.eventMachine.publish(message);
        }
    }
};

})( jQuery );
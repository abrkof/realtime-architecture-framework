/*
 * @category JS Application
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */


(function( $ ) {
// Application namespace
var App = function() {
    var _console;
    return {
      init : function() {
          _console = App.Console({boundingBox: $('div.console')}).getInstance();
          App.MonitorWidget({boundingBox: $('div.widget.monitor')}).getInstance();
          App.NotificationWidget({boundingBox: $('div.widget.notifications')}).getInstance();
          $.rta.connect("../facadeController.php");
      },
      log : function(message) {
          _console.log(message);
      }
    };
}();


App.Console = function(settings) {
return $.jsa.extend({
        name : 'Console',
        HTML_PARSER : {
           list : 'ul'
        },
        log : function(message) {
            var today = new Date();
            this.node.list.prepend('<li>' + today.toString() + ' ' + message + '</li>');
        }
      }, $.jsa.WidgetAbstract, settings);
};

App.MonitorWidget = function(settings) {
return $.jsa.extend({
        name : 'MonitorWidget',
        module : 'MonitorModule',
        HTML_PARSER : {
           img : 'img'
        },
        subscribeRta : function(e, data) {
            App.log('Monitor data received');
            this.node.img.attr('src', data);
        }
      }, $.jsa.RealTimeWidgetAbstract, settings);
};

App.NotificationWidget = function(settings) {
return $.jsa.extend({
        name : 'NotificationWidget',
        module: 'NotificationModule',
        HTML_PARSER : {
           list : 'ul'
        },
        subscribeRta : function(e, data) {
            App.log('A notofication received');
            this.node.list.prepend(data);
        }
      }, $.jsa.RealTimeWidgetAbstract, settings);
};


// Document is ready
$(document).bind('ready.app',App.init);

})( jQuery );
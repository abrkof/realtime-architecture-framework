Few years ago only lazy didn’t say about bringing desktop application experience to the web ones. However in reality, it just meant that user actions didn’t always required page reload, but could change page UI dynamically. As for other application events, they were not controlled dynamically.

Well, now you can find more and more web applications acting really like desktop ones. For example, Facebook and G+ have widgets which update automatically. You can keep the page untouched, but you will see anyway new status updates appear as your friends submitting. The same for notifications. Whenever a new one arrives the counter changes and the notification list extends.

That seems to me as a trend worth to follow.  I’ve been thinking of a solution to vivify widgets on my sites. Now I’m coming up with the following pattern.

![http://dsheiko.com/download//000000127/rta.png](http://dsheiko.com/download//000000127/rta.png)

Making application real-time

Ok, we have various widgets on a page and want them update in real-time. We can have a message broker object ($.rta) with which we subscribe our widgets for update events.
```
var aWidget = (function() {
    return { 
        name : 'aWidget',
        module : 'aModule',
        init : {            
            $.rta.subscribe(this, function(e, data){ });
        }
    }
});
```

Since all my widgets are derived by $.jsa.WidgetAbstract (Please find details in JS Application Design , I extended the class by $.jsa.RealTimeWidgetAbstract, which made the following interface:
```
var aWidget = function(settings) {
return $.jsa.extend({
        name : 'aWidget',
        module : 'aModule',
        subscribeRta : function(e, data) {}

      }, $.jsa.RealTimeWidgetAbstract, settings);
};
```
Pretty easy, is not it? Well, but the message broker is assumed to communicate somehow with the server. There is a bunch of trick called COMET and couple of HTML5 approaches (Server-Sent Events and WebSockets). All can serve, so you find examples and comparison in my article WebSockets vs Server-Sent Events vs Long-polling . In this particular case I’m using long-polling, but leaving place for any other implementation. You can plug it in as an adapter manually.

Long-polling is no real full-duplex asynchronous messaging channel, but a trick based on ability of XMLHttpRequest to wait until the server eventually responds. That is an emulation of server pushing events to the browser. Thus, we don’t have open channels, but make a long-waiting request, passing the message queue onto the server controller. The controller serves the queue in a loop until an update for any of queued widgets is met. The RTA communication bridge gets update data, fires the event for the updated widget and repeats the request. To make it true, when subscribing widgets we actually populate the message queue and start requesting the server only when the queue is complete by $.rta.connect("path to the controller script");

Ok, we have widgets objects and the broker, which is supposed to run on background. It can be done by using a web worker. Let’s put our relatively resource-intensive functionality which makes long-polling requests into a worker. So it will be a “black-box” to which we provide once message queue as a parameter query and controller path (everything for the post request) and keep receiving updates back through the listener function.
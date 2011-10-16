/*
* JS Application
*
* @package JSA
* @author $Author: sheiko $
* @version $Id: jquery.jsa.js, v 1.0 $
* @license GNU
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
*/
(function( $ ) {
    $.jsa = {
        /**
         * Emulates generalization
         * 
         * @param Object subtype
         * @param Object supertype
         * @param Object settings OPTIONAL
         */
        extend : function(subtype, supertype, settings) {

            var params = {parent : supertype};

            if (settings !== undefined) {
               params.settings = settings;
            }
            var instance = {};
            if (subtype.name === undefined || !subtype.name) {
                throw 'Name property must not be empty';
            }
            $.extend(true, instance, supertype);
            $.extend(true, instance, subtype);
            $.extend(true, instance, params);
            return instance;
        }
    };
    /**
     * Base is designed to be a low-level foundation class from which other
     * classes can be derived. It tries to invoke automatically init, renderUI, syncUI methods
     * of every class the last successor class inherit
     **/
    $.jsa.BaseAbstract = {
        settings : null,
        name: 'BaseAbstract',
        parent : null,
        /**
         * Example: object.instanceOf('BaseAbstract') === true
         * @param string name
         */
        instanceOf : function(name) {
            var res = (name == this.name);
            if (this.parent) {
                (function(parent){
                    res = res || (name == parent.name)
                    if (parent.parent !== undefined && parent.parent) {
                        arguments.callee(parent.parent);
                    }
                }(this.parent));
            }
            return res;
        },
        /**
         * Creates an instance of requested class and invokes init, renderUI, syncUI methods
         */
        getInstance : function() {
            var autoStartMethods = ['init', 'renderUI', 'syncUI'];
            var scope = this;
            if (this.parent) {
                (function(scope, parent){
                    $.each(autoStartMethods, function(){
                        if (parent[this] !== undefined) {
                            $.proxy(parent[this], scope)();
                        }
                    });
                    if (parent.parent !== undefined && parent.parent) {
                        arguments.callee(scope, parent.parent);
                    }
                }(this, this.parent));
            }
            $.each(autoStartMethods, function(){
                if (scope[this] !== undefined) {
                    scope[this]();
                }
            });
            return this;
        }
    };
    /**
     * Widget is the foundation class from which all widgets are derived.
     * It provides the following pieces of core functionality on top of
     * what BaseAbstract already provides:
     *  - A common set of widget attributes
     *  - Consistent markup generation support
     */
    $.jsa.WidgetAbstract = $.jsa.extend({
        name: 'WidgetAbstract',
        node : { boundingBox : null },
        init : function() {
           var scope = this;
           if (scope.settings.boundingBox === undefined) {
                throw "boundingBox must be specified";
           }
           scope.node.boundingBox = scope.settings.boundingBox;
           if (!scope.HTML_PARSER) {
               return;
           }
           $.each(scope.HTML_PARSER, function(inx, el){
                if (typeof(el) == 'string') {
                  scope.node[inx] = scope.node.boundingBox.find(el);
                }
           });
        }
    }, $.jsa.BaseAbstract);

})( jQuery );
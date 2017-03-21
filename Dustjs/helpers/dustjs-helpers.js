/**
 * Collection of dustjs helpers that i found useful
 */

'use strict';

var dustjs = (typeof dust === 'undefined') ? require('dustjs-linkedin') : /* istanbul ignore next */ dust;

module.exports = function (dustjs) {

    dustjs.helpers = dustjs.helpers || /* istanbul ignore next */ {};

      //Helper function to remove all protocol in url
    function removeProtocol(text) {
        var result = '';
        try {
            result = text.replace(/http:|https:/g, '');
        } catch(ex) {
            //Do not do anything and return empty value
        }
        return result;
    }

    dustjs.helpers.toHttps = function(chunk, context, bodies, params) {
        var url = removeProtocol(dustjs.helpers.tap(params.url, chunk, context));
        return chunk.write('https:' + url);
    };

    dustjs.helpers.toHttp = function(chunk, context, bodies, params) {
        var url = removeProtocol(dustjs.helpers.tap(params.url, chunk, context));
        return chunk.write('http:' + url);
    };

    dustjs.helpers.relativeProtocol = function(chunk, context, bodies, params) {
        var url = removeProtocol(dustjs.helpers.tap(params.url, chunk, context));
        return chunk.write(url);
    };

    //Create modular ui component: https://eduardoboucas.com/blog/2016/04/15/creating-modular-ui-components-with-dustjs.html
    dust.helpers.partial = function (chunk, context, bodies, params) {
        var newContext = {
            $content: bodies.block
        };
        return chunk.partial(params.$name, context.push(newContext), params);
    };

    dustjs.helpers.arrContains = function(chunk, context, bodies, params) {
        var result = false;
        try {
            var arr = dustjs.helpers.tap(params.arr, chunk, context),
                key = dustjs.helpers.tap(params.key, chunk, context),
                isInteger = dustjs.helpers.tap(params.isInteger, chunk, context);
            if (isInteger === 'true') { //Convert string to integer if want to check for integer in the array
                key = parseInt(key, 10);
            }
            result = (arr.indexOf(key) > -1) ? true : false;
        } catch(ex) {
            //Error in array checking
        }
        if (result === true) {
            chunk = chunk.render(bodies.block, context);
        } else {
            chunk = chunk.render(bodies.else, context);
        }
        return chunk;
    };

    dustjs.helpers.arrLastItem = function(chunk, context, bodies, params) {
        var result = '';
        try {
            var arr = dustjs.helpers.tap(params.arr, chunk, context),
                length =  arr.length;
            result = arr[length - 1];
        } catch(ex) {
            //Error throws if arr parsing failed
        }
        return chunk.write(result);
    };

    dustjs.helpers.arrFirstItem = function(chunk, context, bodies, params) {
        var result = '';
        try {
            var arr = dustjs.helpers.tap(params.arr, chunk, context);
            result = arr[0];
        } catch(ex) {
            //Error throws if arr parsing failed
        }
        return chunk.write(result);
    };

    dustjs.helpers.stringReplace = function (chunk, ctx, bodies, params) {
        var result = '';
        try {
            var text = dustjs.helpers.tap(params.text, chunk, ctx),
                search = dustjs.helpers.tap(params.search, chunk, ctx),
                replace = dustjs.helpers.tap(params.replace, chunk, ctx),
                trim = dustjs.helpers.tap(params.trim, chunk, ctx);
            text = (trim && trim === 'true') ? text.trim() : text;
            result = text.replace(new RegExp(escapeRegExp(search), 'g'), replace);
        } catch(ex) {
            //Return empty when manipulate no-string obj
        }
        return chunk.write(result);
    };

    dustjs.helpers.subString = function(chunk, ctx, bodies, params) {
        var result = '';
        try {
            var text = dustjs.helpers.tap(params.text, chunk, ctx),
                startIndex = parseInt(dustjs.helpers.tap(params.startIndex, chunk, ctx), 10) || 0,
                length = parseInt(dustjs.helpers.tap(params.length, chunk, ctx), 10) || text.length,
                toLowerCase = dustjs.helpers.tap(params.toLowerCase, chunk, ctx);
            if (toLowerCase === 'true') {
                text = text.toLowerCase();
            }
            result = text.substr(startIndex, length);
        } catch(ex) {
            //Exception while manipulate string, return empty result
        }
        return chunk.write(result);
    };

    //Polyfill for array indexOf
    /* istanbul ignore if */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    //Polyfill for string trimming
    /* istanbul ignore if */
    if (!String.prototype.trim) {
        (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }

    //Dust helper string replace with trim
    //Reference from: https://gist.github.com/codyburleson/eb49a3f69de76e3d752a
    /**
     * Processes the given string to escape special meta characters used within
     * Regular Expressions. This is used by the replace helper.
     */
    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }

    return dustjs;
};

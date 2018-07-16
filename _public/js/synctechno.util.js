/**
 * Created by kimtaehyun on 2017. 9. 19..
 */

'use strict';

var STUtils = {

  init: function() {
    if (this.initialized)
      return;

    //  Override String methods
    if (!String.prototype.ellipsis) {
      String.prototype.ellipsis = function(n) {
        return XString.ellipsis(this, n);
      }
    }

    if (!String.prototype.isCSSColorValue) {
      String.prototype.isCSSColorValue = function() {
        return XString.isCSSColorValue(this);
      }
    }

    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(searchString, position) {
        return XString.endsWith(this, searchString, position);
      }
    }

    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        return XString.startsWith(this, searchString, position);
      }
    }


    if (!window.ST_SafeSet) {
      window.ST_SafeSet = function(o, p, v) {
        return STUtils.setPropertySafe(o, p, v);
      }
    }

    if (!window.ST_SafeGet) {
      window.ST_SafeGet = function(o, p, d) {
        return STUtils.getPropertySafe(o, p, d);
      }
    }


    this.initialize = true;
  },

  //  ellipsis string s by given length n
  ellipsis : function(s, n) {
    //  if given ellipsis length is not a number or less then or equals to 0, return original string
    if ((n !== parseInt(n, 10)) || n <= 0)
      return s;

    //  if string length is less than or equals to given ellipsis length n, return original string
    if (s.length <= n) {
      return s;
    }

    //  if given ellipsis length less then 2, rturn original string
    if( n <= 2 )
      return s.substr(0, n);

    //  if given ellipsis length less then or equal 7, ellipsis will applied end of string
    if( n <= 7)
      return (s.length > n) ? s.substr(0,n-1)+"\u2026" : s;

    //  otherwise ellipsis will applied middle of string
    else {
      var p = parseInt((n-3)/2 + 0.5);
      var e = n - p - 3;
      return (s.length > n) ? s.substr(0, p)+" \u2026 "+s.substr(s.length-e, e) : s;
    }
  },

  //  check the value of given string can be used as CSS color value
  isCSSColorValue : function(s){
    var CSS_COLOR_PATTERN_REGEX = "#(?:[a-f\\d]{6}|[a-f\\d]{3})|" +    // #FFFFFF or #FFF
      "rgb\\((?:(?:\\s*\\d+\\s*,){2}\\s*\\d+|(?:\\s*\\d+(?:\\.\\d+)?%\\s*,){2}\\s*\\d+(?:\\.\\d+)?%)\\s*\\)|" +
      "rgba\\((?:(?:\\s*\\d+\\s*,){3}|(?:\\s*\\d+(?:\\.\\d+)?%\\s*,){3})\\s*\\d+(?:\\.\\d+)?\\s*\\)|" +
      "transparent|aliceblue|antiquewhite|aquamarine|aqua|azure|beige|bisque|black|blanchedalmond|blueviolet|blue|brown|burlywood5|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|goldenrod|gold|gray|greenyellow|green|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|lime|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olivedrab|olive|orangered|orange|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|whitesmoke|white|yellowgreen|yellow";

    var CSS_COLOR_PATTERN = new RegExp(CSS_COLOR_PATTERN_REGEX, 'gi');
    return CSS_COLOR_PATTERN.test(s);
  },


  endsWith : function(s, searchString, position) {
    var subjectString = s.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  },


  startsWith : function(s, searchString, position){
    position = position || 0;
    return s.substr(position, searchString.length) === searchString;
  },

  //  usage
  //  var value = getPropertySafe(obje, ['a', 'b', 'c'], 'DefaultValue');
  //  @ 'DefaultValue' is optional
  //
  //  @see https://github.com/acstll/deep-get-set
  getPropertySafe: function (obj, path, defValue) {
    var hasOwnProp = Object.prototype.hasOwnProperty;

    var keys = Array.isArray(path) ? path : path.split('.');
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!obj || !hasOwnProp.call(obj, key)) {
        obj = undefined;
        break;
      }
      obj = obj[key];
    }

    if(arguments.length > 2 && obj === undefined)
      return defValue;

    return obj;
  },

  //  usage
  //    var obj = {};
  //    setPropertySafe(obj, ['a', 'b', 'c'], 'value');
  //    >> obj === {'a': {'b': {'c': 'value'}}}
  //
  //  @limitation
  //    var obj = {
  //      'a': 'stringvalue'
  //    }
  //    setPropertySafe(obj.a, ['b', 'c'], 'new value')
  //    >> result: exception
  //
  //  @see https://github.com/acstll/deep-get-set
  setPropertySafe: function(obj, path, value) {
    if(obj === null || obj === undefined || typeof obj == 'string' || Array.isArray(obj) )
      throw new Error( 'Illegal argument: obj parameter must be an object. Not allowed null, undefined, string and Array');

    var hasOwnProp = Object.prototype.hasOwnProperty;

    var keys = Array.isArray(path) ? path : path.split('.');
    for (var i = 0; i < keys.length - 1; i++) {
      var key = keys[i];
      if (!hasOwnProp.call(obj, key) || typeof obj[key] == 'string' || Array.isArray(obj[key]) || obj[key] === null) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    obj[keys[i]] = value;

    return value;
  }

};

STUtils.init();


//module.exports=STUtils;

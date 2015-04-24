var Utils = {
  objLength: function(obj) {
    var length = 0;
    for (var i in obj) length++;
    return length;
  },
  merge: function() {
    var result = {};
    for (var i in arguments) {
      var arg = arguments[i];
      for (var prop in arg) {
        result[prop] = arg[prop];
      }
    }
    return result;
  },
  val: function(obj) {
    for (var k in obj) return obj[k];
  },
  addCSSRule: function(selector, rules, index) {
    var indexCSS = this._getIndexCSS();
    window.indexCSS = indexCSS;
    
    if ('insertRule' in indexCSS) {
      indexCSS.insertRule(selector + '{' + rules + '}', index);
    } else if ('addRule' in indexCSS) {
      indexCSS.addRule(selector, rules, index);
    } else {
      console.warn('CSS insertion not supported by browser.');
    }
  },
  removeCSSRule: function(selector, property) {
    var indexCSS = this._getIndexCSS();

    for (var i = 0; i < indexCSS['rules'].length; i++) {
      if (indexCSS['rules'][i].selectorText == selector) {
        if (property == undefined) {
          indexCSS.deleteRule(i);
        } 
      }
    }
  },
  _getIndexCSS: function() {
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; i++) if (ss[i].href && ss[i].href.match(/index.css$/)) return ss[i];
  },
};

module.exports = Utils;

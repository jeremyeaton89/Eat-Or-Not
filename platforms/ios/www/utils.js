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
};

module.exports = Utils;

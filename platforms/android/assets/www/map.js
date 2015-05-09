function Map() {};

Map.prototype.getMap = function() {
  if (Map.prototype.map) {
    return Map.prototype.map;
  } else {
    console.log('Map not set. Use Map.setMap().');
    return null;
  }
};

Map.prototype.setMap = function(map) {
  Map.prototype.map = map;
};

module.exports = new Map();

var Firebase = require('./firebase');
var Utils    = require('./utils');

function User(data) {
  this.facebookId = Object.keys(data)[0];
  this.firstName  = data[this.facebookId].firstName;
  this.lastName   = data[this.facebookId].lastName;
  this.endpoint   = Firebase.child('users/' + this.facebookId);
}

User.prototype.getPlace = function(id, callback) {
  this.endpoint.child('places').orderByKey().equalTo(id).once('value', function(snapshot) {
    callback(Utils.val(snapshot.val()));
  });  
}

module.exports = User;

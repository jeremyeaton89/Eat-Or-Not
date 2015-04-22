var Firebase = require('./firebase');

function User(data) {
  this.facebookId = data.uid;
  this.firstName  = data.firstName;
  this.lastName   = data.lastName;
}

module.exports = User;

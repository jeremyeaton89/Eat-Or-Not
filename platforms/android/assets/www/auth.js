var User = require('./user');

function Auth() {};

Auth.prototype.getUser = function() { 
  if (Auth.prototype.user) {
    return Auth.prototype.user;
  } else {
    console.log('User not set. Use Auth.setUser().');
  }
};

Auth.prototype.setUser = function(user) {
  Auth.prototype.user = user;
};

module.exports = new Auth();

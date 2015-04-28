var User = require('./user');
var Firebase = require('./firebase');

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

  // user.endpoint.on("value", function(snapshot) {
  //   var data = snapshot.val();
  //   if (data) {
  //     Auth.prototype.user = new User(data);
  //     console.log('auto update!!!');
  //   } else {
  //     console.warn('auto update of current user failed.');
  //   }
  // });

};

module.exports = new Auth();

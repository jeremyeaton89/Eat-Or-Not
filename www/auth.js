var User = require('./user');

var Auth = (function() {
  var user;

  return {
    getUser: function() {
      if (user) {
        return user;
      } else {
        console.log('User not set. Use Auth.setUser().');
      }
    },
    setUser: function(data) {
      user = new User(data);
    }
  };
})();

module.exports = Auth;

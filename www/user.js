var Firebase       = require('./firebase');
var Utils          = require('./utils');
var AvatarUploader = require('./avatarUploader');

function User(json) {
  var data = Utils.unwrapObj(json);

  this.id          = data.id;
  this.firstName   = data.firstName;
  this.lastName    = data.lastName;
  this.avatarUrl   = data.avatarUrl;
  this.accessToken = data.accessToken
  this.endpoint    = Firebase.child('users/' + this.id);

  this.fetchLikes = function(callback) {
    this.endpoint.child('places').orderByChild('like').equalTo(true).once('value', function(snapshot) {
      var places = snapshot.val();
      callback(Utils.unwrapObjs(places));
    }.bind(this))
  }.bind(this);

  this.getLargeImage = function() {
    // Get large image from FB and update avatarUrl
    FB.api('/' + this.id + '/picture?width=600&redirect=1', function(res) { 
      if (res && !res.error) { 

      //   var xhr = new XMLHttpRequest();

      //   xhr.open('GET', res.data.url, true);
      //   xhr.responseType = 'blob';
      //   xhr.onload = function(e) {
        
      //     // Get blob from url for upload
      //     if (xhr.status == 200) {
      //       var uploader = new AvatarUploader(this);
      //       var blob = xhr.response;
      //       blob.name =  this.id + '.' + blob.type.split('/')[1];
      //       console.log('blobl', blob);
      //       // uploader.upload(blob, function(url) {
      //       //   this.avatarUrl = url;
      //       // }.bind(this));
      //     }
      //   }.bind(this);
      //   xhr.send();

        this.avatarUrl = res.data.url;
        this.endpoint.update({avatarUrl: this.avatarUrl});
      } 
    }.bind(this));
  }.bind(this);
}

User.prototype.getPlace = function(id, callback) {
  this.endpoint.child('places').orderByKey().equalTo(id).once('value', function(snapshot) {
    callback(Utils.val(snapshot.val()));
  });  
}

User.fetch = function(id, callback) {
  Firebase.child('users').orderByKey().equalTo(id).once('value', function(snapshot) {
    var data = snapshot.val();
    callback(
      data ? new User(data) : null
    );
  });
}

User.create = function(data, callback) {
  var id = data.uid.split(':')[1];

  // listen for the user, then add it.
  User.fetch(id, function(user) {
    if (user) {
      user.getLargeImage();
      callback(user);
    } else {
      console.warn('No user found.');
    }
  });
  Firebase.child('users/' + id).set({
    'id': id,
    'firstName': data.facebook.cachedUserProfile.first_name,
    'lastName': data.facebook.cachedUserProfile.last_name,
    'avatarUrl': data.facebook.cachedUserProfile.picture.data.url,
    'accessToken': data.facebook.accessToken,
  });
}  

module.exports = User;

var Firebase = require('./firebase');
var Utils    = require('./utils');

function User(data) {
  this.facebookId = Object.keys(data)[0];
  this.firstName  = data[this.facebookId].firstName;
  this.lastName   = data[this.facebookId].lastName;
  console.log(data[this.facebookId]);

  // this.avatarUrl  = data[this.facebookId]
  this.endpoint   = Firebase.child('users/' + this.facebookId);
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
      data ? new User(data) : data
    );
  });
}

User.create = function(data, callback) {
  // listen for the user, then add it.
  User.fetch(data.uid, function(userData) {
    if (userData) {
      callback(new User(userData));
    } else {
      console.warn('No user found.');
    }
  });
  Firebase.child('users/' + data.uid).set({
    'firstName': data.facebook.cachedUserProfile.first_name,
    'lastName': data.facebook.cachedUserProfile.last_name,
    'avatarUrl': data.facebook.cachedUserProfile
  });
}

// User.getLargeImage 
//   // Get large image from FB and update avatarUrl
//   FB.api('/' + data.facebook.id + '/picture?width=200&redirect=1', (res) => { 
//     if (res && !res.error) { 
//       var xhr = new XMLHttpRequest();

//       xhr.open('GET', res.data.url, true);
//       xhr.responseType = 'blob';
//       xhr.onload = (e) => {
      
//         // Get blob from url for upload
//         if (xhr.status == 200) {
//           var uploader = new AvatarUploader(this);
//           var blob = xhr.response;
//           blob.name =  this.getUId() + '.' + blob.type.split('/')[1];
          
//           uploader.upload(blob, (url) => {
//             this.setAvatarUrl(url);
//           });
//         }
//       };
//       xhr.send();
//     } 
//   });

module.exports = User;

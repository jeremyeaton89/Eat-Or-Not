var Config = require('./config');

function AvatarUploader(user) {
  this.user = user;

  var AWS = window.AWS;
  AWS.config.region = 'us-west-2';
  AWS.config.credentials = new AWS.WebIdentityCredentials({
    RoleArn: Config.AVATAR_ROLE_ARN,
    ProviderId: 'graph.facebook.com',
    WebIdentityToken: user.accessToken,
  });

  this.bucket = new AWS.S3({params: {Bucket: 'rende-avatar'}});
}

AvatarUploader.prototype.upload = function(file, callback) {
  var params = {
    Key: file.name, 
    ContentType: file.type, 
    Body: file, 
    ACL: 'public-read'
  };

  this.bucket.upload(params, function(err, data) {
    var url;

    if (err) {
      console.log('Upload Error: ' + err);
    } else {
      url = data.Location;
      this.user.avatarUrl = url; 
      callback(url);
    }
  });
}

module.exports = AvatarUploader;

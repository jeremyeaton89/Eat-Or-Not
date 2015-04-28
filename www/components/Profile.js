/** @jsx React.DOM */
var React          = require('react');
var Auth           = require('../auth');
var Utils          = require('../utils');
var Firebase       = require('../firebase');
var AvatarUploader = require('../AvatarUploader');
var Header         = require('./Header');
var PlaceListItem  = require('./PlaceListItem');

var Profile = React.createClass({
  getInitialState: function() {
    return {
      likes: [],
      dislikes: [], 
    };
  },
  componentWillMount: function() {
    this.getUserPlaces();
  },
  getUserPlaces: function() {
    Auth.getUser().fetchLikes(function(likedPlaces) {
      this.setState({
        likes: likedPlaces,
      });
    }.bind(this));
  },
  uploadAvatar: function() {
    var uploader = new AvatarUploader(Auth.getUser());
    var imgUrl = this.refs.avatar.getDOMNode().src;
    console.log(imgUrl);
  },
  logout: function() {
    Firebase.unauth();
    location.hash = '#';
  },
  highlightPlace: function(key) {
    console.log('highlight Li: ' + key);
  },
  render: function() {
    var likes = this.state.likes.map(function(place, i) {
      return (
        <PlaceListItem 
          id={place.id} 
          name={place.name} 
          imgUrl={place.imgUrl} 
          index={i}
          highlightPlace={this.highlightPlace}
        />
      )
    }.bind(this));

    return (
      <div className='page'>
        <Header title={Auth.getUser().firstName} right='home' />
        <div style={styles.avatarContainer}>
          <img
            ref='avatar'
            style={styles.avatar}
            src={Auth.getUser().avatarUrl}
            onClick={this.uploadAvatar}
          /> 
        </div>
        <div
          ref='carousel'
          style={styles.carousel}>
          <h2 style={styles.carouselTitle}>Likes</h2>

          <ul
            style={styles.likes}
            ref='likes'
            style={styles.likes}>
            {likes}
          </ul>

          <ul
            ref='dislikes'
            style={styles.dislikes}>
            {this.state.dislikes}
          </ul>

        </div>
        <button style={styles.logout} onClick={this.logout}>Log Out</button>
      </div>
    );
  }
});

styles = {
  logout: {
    position: 'absolute',
    width: '90%',
    margin: '0 5%',
    height: 35,
    bottom: 90,
    outline: 'none',
    border: 'none',
    background: 'rgba(128, 128, 128, 0.5)',
  },
  avatar: {
    width: '100%',
    margin: 'auto',
    bottom: '-100%',
    top: '-100%',
    position: 'absolute',
  },
  avatarContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  carousel: {
    width: '100%',
    height: '100%',
  },
  carouselTitle: {
    margin: 0,
    textAlign: 'center',
    fontSize: 30,
    background: 'gray',
    lineHeight: '60px',
  },
  likes: {
    listStyleType: 'none',
    margin: 0,
    padding: '5px 0 0 0 ',
  },
  dislikes: {

  },
}

module.exports = Profile;

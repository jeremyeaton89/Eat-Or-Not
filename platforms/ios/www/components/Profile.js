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
    this.addClassStyles();
  },
  addClassStyles: function() {
    var transitionCSS = [
      '-webkit-transition: left .35s cubic-bezier(0.455, 0.03, 0.515, 0.955);',
      'transition: left .35s cubic-bezier(0.455, 0.03, 0.515, 0.955);',
    ].join('');

    Utils.addCSSRule('.transition-tab', transitionCSS, 1);
    Utils.addCSSRule('.active-tab', 'font-weight: 600 !important;border-bottom: 2px solid black;', 1);
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
  slideTabs: function(destination) {
    var left   = this.refs.leftTab.getDOMNode();
    var center = this.refs.centerTab.getDOMNode();
    var right  = this.refs.rightTab.getDOMNode();

    switch (destination) {
      case 'left':

        break;
      case 'center':

        break;
      case 'right':

        break;
    } 
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

          <ul style={styles.tabs}>
            <li 
              ref='leftTab'
              className='transition-tab' 
              style={styles.tabContainer}>
              <div 
                className='left-tab'
                style={Utils.merge(styles.tab, styles.leftTab)}>
                Friends
              </div>
            </li>
            <li 
              ref='centerTab'
              className='transition-tab' 
              style={styles.tabContainer}>
              <div 
                className='center-tab active-tab'
                style={Utils.merge(styles.tab, styles.centerTab)}>
                Likes
              </div>
            </li>
            <li 
              ref='rightTab'
              className='transition-tab' 
              style={styles.tabContainer}>
              <div 
                className='right-tab'
                style={Utils.merge(styles.tab, styles.rightTab)}>
                Dislikes
              </div>
            </li>
          </ul>
          <hr style={styles.tabsHr} />

          <ul
            className='hidden'
            style={styles.friends}
            ref='friends'>
            <li>Josh</li>
            <li>Alec</li>
          </ul>

          <ul
            ref='likes'
            style={styles.likes}>
            {likes}
          </ul>

          <ul
            className='hidden'
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
  tabs: {
    listStyleType: 'none',
    margin: 0,
    paddingTop: 15,
    height: 45,
    textAlign: 'center',
    boxSizing: 'border-box',
    fontSize: 15,
    fontWeight: 100,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabsHr: {
    width: '95%',
    margin: '0 2.5% 0 2.5%',
  },
  tabContainer: {
    background: 'white',
    position: 'absolute',
    left: '50%'
  },
  tab: {
    display: 'inline-block',
    position: 'relative',
    width: 75,
    height: 22,
  },
  leftTab: {
    left: '-95%',
  },
  centerTab: {
    left: '-50%',
  },
  rightTab: {
    left: '-5%',
  },
  carouselTitle: {
    margin: 0,
    textAlign: 'center',
    fontSize: 30,
    background: 'gray',
    lineHeight: '60px',
  },
  likes: {
    overflow: 'auto',
    listStyleType: 'none',
    margin: 0,
    padding: '5px 0 0 0 ',
  },
  dislikes: {

  },
}

module.exports = Profile;

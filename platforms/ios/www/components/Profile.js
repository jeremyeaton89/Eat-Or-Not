/** @jsx React.DOM */
var React              = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Auth               = require('../auth');
var Utils              = require('../utils');
var Firebase           = require('../firebase');
var AvatarUploader     = require('../AvatarUploader');
var Header             = require('./Header');
var PlaceListItem      = require('./PlaceListItem');

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
  getDefaultProps: function() {
    return {
      tabs:  ['leftTab', 'rightTab'],    
      lists: ['likes', 'dislikes'],
    };
  },
  addClassStyles: function() {
    var transitionFontWeight = [
      '-webkit-transition: font-weight .1s ease-out;',
      'transition: font-weight .1s ease-out;',
    ].join('');

    Utils.addCSSRule('.transition-font-weight', transitionFontWeight, 1);
    Utils.addCSSRule('.active-tab', 'font-weight: 600 !important;border-bottom: 2px solid black;', 1);
  },
  getUserPlaces: function() {
    Auth.getUser().fetchLikes(function(likedPlaces) {
      this.setState({
        likes: likedPlaces,
      });
    }.bind(this));
    Auth.getUser().fetchDislikes(function(dislikedPlaces) {
      this.setState({
        dislikes: dislikedPlaces,
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
  changeTab: function(key) {
    var selectedTab = this.refs[this.props.tabs[key]].getDOMNode();
    if (selectedTab.classList.contains('active-tab')) return;

    var currentTab = document.getElementsByClassName('active-tab')[0];
    var currentKey = currentTab.getAttribute('data-key');

    currentTab.classList.remove('active-tab');
    this.refs[this.props.lists[currentKey]].getDOMNode().classList.add('hidden');

    selectedTab.classList.add('active-tab');
    this.refs[this.props.lists[key]].getDOMNode().classList.remove('hidden');

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

    var dislikes = this.state.dislikes.map(function(place, i) {
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
        <div style={styles.carousel}>

          <ul style={styles.tabs}>
            <li style={Utils.merge(styles.tabContainer, {left: '30%'})}>
              <div 
                ref='leftTab'
                className='active-tab transition-font-weight'
                data-key={0}
                style={styles.tab}
                onClick={this.changeTab.bind(this, 0)}>
                Likes
              </div>
            </li>
            <li style={Utils.merge(styles.tabContainer, {left: '70%'})}>
              <div 
                ref='rightTab'
                className='transition-font-weight'
                data-key={1}
                style={styles.tab}
                onClick={this.changeTab.bind(this, 1)}>
                Dislikes
              </div>
            </li>
          </ul>
          <hr style={styles.tabsHr} />

            <ul
              ref='likes'
              style={styles.list}>
              {likes.length ? likes : <li style={styles.emptyState}>You Have Not Liked Any Places</li>}
            </ul>

            <ul
              className='hidden'
              ref='dislikes'
              style={styles.list}>
              {dislikes.length ? dislikes : <li style={styles.emptyState}>You Have Not Disliked Any Places</li>}
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
    height: 30,
    bottom: 10,
    outline: 'none',
    border: 'none',
    background: 'rgba(128, 128, 128, 0.5)',
    fontSize: 14,
    fontWeight: 100,
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    paddingTop: 10,
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
    position: 'absolute',
  },
  tab: {
    display: 'inline-block',
    position: 'relative',
    padding: '5px 5px 0 5px',
    height: 22,
    left: '-50%',
    cursor: 'pointer',
  },
  carouselTitle: {
    margin: 0,
    textAlign: 'center',
    fontSize: 30,
    background: 'gray',
    lineHeight: '60px',
  },
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: '5px 0 0 0',
    position: 'absolute',
    width: '100%',
    top: 320,
    bottom: 50,
    overflowY: 'scroll',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  },
  emptyState: {
    textAlign: 'center',
    fontFamily: 'Indie Flower',
    fontSize: 24,
    marginTop: 20,
    color: '#D58406',
    height: 35,
  },
}

module.exports = Profile;

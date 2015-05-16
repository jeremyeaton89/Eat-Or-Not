/** @jsx React.DOM */
var React              = require('react/addons');
var Firebase           = require('../firebase');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Utils              = require('../utils');
var Link               = require('react-router-component').Link;
var History            = require('../history');

var Header = React.createClass({
  getDefaultProps: function() {
    return {
      searchBarWidth: (window.innerWidth > 0 ? window.innerWidth : screen.width) - 108,
    };
  },
  componentWillMount: function() {
    this.addClassStyles();
  },
  componentDidMount: function() {
    if (this.props.left == 'search' && location.hash == '#/search') {
      setTimeout(function() {
        var searchBar = this.refs.searchBar.getDOMNode();
        searchBar.focus();  
        cordova.plugins.Keyboard.show();
      }.bind(this), 200)
    }
  },
  addClassStyles: function() {
    var slide = [
      '-webkit-transition: width .1s cubic-bezier(0.455, 0.03, 0.515, 0.955);',
      'transition: width .1s cubic-bezier(0.455, 0.03, 0.515, 0.955);',
      '-webkit-transform: translate3d(0,0,0);',
      'transform: translate3d(0,0,0);',
    ].join('');

    Utils.addCSSRule('.searchBar-slide', slide, 1)
  },
  logout: function() {
    Firebase.unauth();
    location.hash = '#';
  },
  animateSearchBar: function() {
    var $searchBar = $(this.refs.searchBar.getDOMNode());

    if ($searchBar.hasClass('invisible')) {
      $searchBar.css({width: this.props.searchBarWidth});
      $searchBar.removeClass('invisible');
      $searchBar.on('webkitTransitionEnd', function() {
        $searchBar.off('webkitTransitionEnd');
        $searchBar.focus();
        setTimeout(function() {
          $(this.refs.profile.getDOMNode()).addClass('hidden');
          $(this.refs.cancel.getDOMNode()).removeClass('hidden');
        }.bind(this), 200);
      }.bind(this));
    } else {
      $searchBar.css({width: 33});
      $searchBar.on('webkitTransitionEnd', function() {
        $searchBar.off('webkitTransitionEnd');
        $searchBar.val('').addClass('invisible');
        $(this.refs.profile.getDOMNode()).removeClass('hidden');
        $(this.refs.cancel.getDOMNode()).addClass('hidden');
      }.bind(this));
    }
  },
  handleChange: function(e) {
    var value = this.refs.searchBar.getDOMNode().value;
    var $xIcon = $(this.refs.xIcon.getDOMNode());

    value ? $xIcon.removeClass('hidden') : $xIcon.addClass('hidden');
    this.props.searchHandlers.change(e);
  },
  handleBlur: function(e) {
    setTimeout(function() {
      if (this.xIconClick) {
        this.xIconClick = false;
      } else {
        if (!this.refs.searchBar.getDOMNode().classList.contains('invisible')) this.animateSearchBar(); // if user taps 'done'
        this.props.searchHandlers.blur();
      }
    }.bind(this), 200)
  },
  clearSearchBar: function() {
    this.xIconClick = true;
    $(this.refs.searchBar.getDOMNode()).val('').focus();
    $(this.refs.xIcon.getDOMNode()).addClass('hidden');
    this.handleChange();
  },
  render: function() {
    var left      = '';
    var right     = ''; 
    var searchBar = '';

    switch(this.props.left) {
      case 'back':
        left = 
          <Link 
            transitionName='right'
            href={History.getReferrerHash()}
            style={styles.iconContainer}>
            <div style={Utils.merge(styles.icon, { backgroundImage: 'url(img/white-arrow.png)'})}></div>
          </Link> 
        break;
      case 'logout':
        left =
          <a
            onClick={this.logout}
            style={styles.iconContainer}>
            <div style={Utils.merge(styles.icon, { backgroundImage: 'url(img/power-icon.png)'})}></div>
          </a>;
        break;
      case 'search':
        left = 
          <a 
            onClick={this.animateSearchBar}
            style={styles.iconContainer}>
            <div style={Utils.merge(styles.icon, { backgroundImage: 'url(img/search-icon.png)'})}></div>
          </a>;

        searchBar =
          <div>
            <input
              ref         = 'searchBar'
              type        = 'search'
              placeholder = 'Search Nearby Places...'
              className   = 'searchBar-slide invisible'
              style       = {styles.searchBar} 
              onChange    = {this.handleChange}
              onBlur      = {this.handleBlur}
              onFocus     = {this.props.searchHandlers.focus}
            />
            <div 
              ref='xIcon'
              style={Utils.merge(styles.xIconContainer, {left: this.props.searchBarWidth + 22})}
              className='hidden'
              onClick={this.clearSearchBar}>
              <img 
                src='img/x-icon.png'
                style={styles.xIcon}
              />
            </div>
          </div>
        break;
    };

    switch(this.props.right) {
      case 'profile':
        right = 
          <div>
            <Link
              ref='profile'
              noTransition
              style={Utils.merge(styles.iconContainer, {right: 5})}
              href='/profile'>
              <div style={Utils.merge(styles.icon, {backgroundImage: 'url(img/profile-icon.png)'})}></div> 
            </Link>
            <a
              ref='cancel'
              className='hidden'
              style={Utils.merge(styles.iconContainer, {right: 5})}
              onClick={this.animateSearchBar.bind(this, true)}>
              <div style={styles.cancel}>Cancel</div>
            </a>
          </div>
        break;
      case 'home':
        right = 
          <Link
            noTransition
            style={Utils.merge(styles.iconContainer, {right: 5})}
            href='/'>
            <div style={Utils.merge(styles.icon, {backgroundImage: 'url(img/home-icon.png)'})}></div> 
          </Link>
        break;
    };

    return(
      <header style={styles.header}>
        {left}
        {searchBar}
        <div style={styles.titleContainer}>
          <h1 
            ref='title' 
            style={styles.title}>
            {this.props.title}
          </h1>
        </div>
        {right}
      </header>
    )
  }  
});

var styles = {
  header: {
    height: 75,
    background: '#3258ED',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  icon: {
    height: 25,
    width: 25,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    margin: '10px auto',  
  },
  cancel: {
    margin: '12px 0 0 0',
    color: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 25,
    width: 50,
    height: 50,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  title: {
    fontFamily: 'Indie Flower',
    color: 'white',
    textAlign: 'center',
    margin: 0,
    position: 'relative',
    left: '-50%',
    height: 52,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleContainer: {
    position: 'absolute',
    left: '50%',
    width: '75%',
    top: 28,
  },
  searchBar: {
    position: 'absolute',
    left: 46,
    top: 30,
    width: 33,
    zIndex: 1,
    outline: 'none',
    borderRadius: 20,
    padding: '5px 25px 0 10px',
    boxSizing: 'border-box',
    height: 33,
    border: 'none',
    fontSize: 14,
  },
  xIcon: {
    width: 12,
    height: 12,
    position: 'relative',
    top: -3.5,
    left: 3,
  },
  xIconContainer: {
    background: 'rgba(0, 0, 0, 0.33)',
    width: 18,
    height: 18,
    borderRadius: 21,
    position: 'absolute',
    top: 38,
    zIndex: 3,
    cursor: 'pointer',
  },
}

module.exports = Header;

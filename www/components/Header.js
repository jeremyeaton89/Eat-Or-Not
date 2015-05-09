/** @jsx React.DOM */
var React              = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Utils              = require('../utils');
var Link               = require('react-router-component').Link;
var History            = require('../history');

var Header = React.createClass({
  getDefaultProps: function() {
    return {
      searchBarWidth: (window.innerWidth > 0 ? window.innerWidth : screen.width) - 98,
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
  animateSearchBar: function() {
    var searchBar = this.refs.searchBar.getDOMNode();

    if (searchBar.classList.contains('invisible')) {
      searchBar.style.width = this.props.searchBarWidth + 'px';
      searchBar.classList.remove('invisible');
      searchBar.addEventListener('webkitTransitionEnd', function() {
        searchBar.removeEventListener('webkitTransitionEnd', arguments.callee);
        searchBar.focus();
      });
    } else {
      searchBar.style.width = '33px';
      searchBar.addEventListener('webkitTransitionEnd', function() {
        searchBar.removeEventListener('webkitTransitionEnd', arguments.callee);
        searchBar.classList.add('invisible');
      });
    }
  },
  initAutocomplete: function() {
    var searchBar = this.refs.searchBar.gedDOMNode();
    var autocomplete = new google.maps.places.Autocomplete(searchBar);
    autocomplete.setTypes(['establishment']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      console.log('place change!!!');
    });
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
      case 'search':
        left = 
          <a 
            onClick={this.animateSearchBar}
            style={styles.iconContainer}>
            <div style={Utils.merge(styles.icon, { backgroundImage: 'url(img/search-icon.png)'})}></div>
          </a>;

        searchBar =
          <input
            ref         = 'searchBar'
            type        = 'search'
            placeholder = 'Search Nearby Places...'
            className   = 'searchBar-slide invisible'
            style       = {styles.searchBar} 
            onKeyUp     = {this.props.searchHandlers.keyup}
            onFocus     = {this.props.searchHandlers.focus}
            onBlur      = {this.props.searchHandlers.blur}
          />;
        break;
    };

    switch(this.props.right) {
      case 'profile':
        right = 
          <Link
            noTransition
            style={Utils.merge(styles.iconContainer, {right: 5})}
            href='/profile'>
            <div style={Utils.merge(styles.icon, {backgroundImage: 'url(img/profile-icon.png)'})}></div> 
          </Link>
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
      case 'cancel':
        right = 
          <a
            style={Utils.merge(styles.iconContainer, {right: 5})}
            onClick={this.animateSearchBar.bind(this, true)}>
            <div style={styles.cancel}>Cancel</div>
          </a>
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
    padding: '5px 0 0 10px',
    boxSizing: 'border-box',
    height: 33,
    border: 'none',
    fontSize: 14,
  },
}

module.exports = Header;

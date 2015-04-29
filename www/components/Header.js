/** @jsx React.DOM */
var React   = require('react');
var Utils   = require('../utils');
var Link    = require('react-router-component').Link;
var History = require('../history');

var Header = React.createClass({
  getDefaultProps: function() {
    return {
      searchBarWidth: (window.innerWidth > 0 ? window.innerWidth : screen.width) - 94,
    }
  },
  animateSearchBar: function() {
    var searchBar = this.refs.searchBar.getDOMNode();
    var title = this.refs.title.getDOMNode();

    if (searchBar.classList.contains('invisible')) {
      title.classList.remove('fade-in');
      title.classList.add('fade-out');
      searchBar.classList.remove('invisible');
      searchBar.style.width = this.props.searchBarWidth + 'px';
      searchBar.classList.add('searchBar-slide-out');
      searchBar.focus();
      searchBar.focus();
      searchBar.addEventListener('webkitTransitionEnd', function() {
        searchBar.removeEventListener('webkitTransitionEnd', arguments.callee);
        searchBar.classList.remove('searchBar-slide-out');
      });
    } else {
      searchBar.style.width = '33px';
      searchBar.classList.add('searchBar-slide-in');
      searchBar.addEventListener('webkitTransitionEnd', function() {
        searchBar.removeEventListener('webkitTransitionEnd', arguments.callee);
        searchBar.classList.remove('searchBar-slide-in');
        searchBar.classList.add('invisible');
        title.classList.remove('fade-out');
        title.classList.add('fade-in');
      });
    }
  },
  render: function() {
    var left  = '';
    var right = ''; 

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
          </a> 
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
    };

    return(
      <header style={styles.header}>
        {left}
        <input 
          ref='searchBar'
          type='search'
          className='invisible'
          style={styles.searchBar} 
        />
        <div style={styles.titleContainer}>
          <h1 ref='title' style={styles.title}>{this.props.title}</h1>
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
    position: 'absolute',
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
  iconContainer: {
    position: 'absolute',
    top: 25,
    width: 50,
    height: 50,
    cursor: 'pointer',
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
    left: 45,
    top: 30,
    width: 33,
    zIndex: 1,
    outline: 'none',
    borderRadius: 20,
    padding: '5px 0 0 10px',
    boxSizing: 'border-box',
    height: 33,
    border: 'none',
  },
}

module.exports = Header;

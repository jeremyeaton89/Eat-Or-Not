/** @jsx React.DOM */
var React = require('react');
var Utils = require('../utils');
var Link  = require('react-router-component').Link;

var Header = React.createClass({
  render: function() {
    var left  = '';
    var right = '';

    switch(this.props.left) {
      case 'back':
        left = 
          <Link 
            transitionName='right'
            href='/' 
            style={styles.leftIconContainer}>
            <div style={Utils.merge(styles.icon, { backgroundImage: 'url(img/white-arrow.png)'})}></div>
          </Link> 
        break;
    };

    switch(this.props.right) {
      case 'profile':
        right = 
          <Link
            noTransition
            style={styles.rightIconContainer}
            href='/profile'>
            <div style={Utils.merge(styles.icon, {backgroundImage: 'url(img/profile-icon.png)'})}></div> 
          </Link>
        break;
      case 'home':
        right = 
          <Link
            noTransition
            style={styles.rightIconContainer}
            href='/'>
            <div style={Utils.merge(styles.icon, {backgroundImage: 'url(img/home-icon.png)'})}></div> 
          </Link>
        break;
    };

    return(
      <header style={styles.header}>
        {left}
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>{this.props.title}</h1>
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
  },
  leftIconContainer: {
    position: 'absolute',
    top: 22,
    width: 50,
    height: 50,
    cursor: 'pointer',
  },
  backArrow: {
    height: 20,
    width: 20,
    position: 'relative',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    margin: '15px auto',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 5,
    top: 28,
    width: 50,
    height: 50,
  },
  icon: {
    height: 25,
    width: 25,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    margin: '10px auto',  
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
}

module.exports = Header;

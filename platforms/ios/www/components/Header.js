/** @jsx React.DOM */
var React = require('react');
var Utils = require('../utils');
var Link  = require('react-router-component').Link;

var Header = React.createClass({
  render: function() {
    return(
      <header style={styles.header}>
        <Link 
          className={this.props.back === 'true' ? '' : 'hidden'}
          transitionName='right'
          href='/' 
          style={styles.backButton}>
          <div style={Utils.merge(styles.backArrow, { backgroundImage: 'url(img/white-arrow.png)'})}></div>
        </Link>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>{this.props.title}</h1>
        </div>
        <Link
          className={this.props.profile === 'true' ? '' : 'hidden'}
          noTransition
          style={styles.profileButton}
          href='/profile'>
          <div style={styles.profileIcon}></div> 
        </Link>
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
  backButton: {
    position: 'absolute',
    top: 25,
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
  profileButton: {
    position: 'absolute',
    right: 5,
    top: 28,
    width: 50,
    height: 50,
  },
  profileIcon: {
    height: 25,
    width: 25,
    backgroundImage: 'url(img/profile-icon.png)',
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
  }
}

module.exports = Header;

/** @jsx React.DOM */
var React = require('react');
var Utils = require('../utils');
var Link  = require('react-router-component').Link;

var Header = React.createClass({
  render: function() {
    return(
      <header style={styles.header}>
        <Link 
          className={this.props.back==='true' ?'':' hidden'}
          transitionName='right'
          href='/' 
          style={styles.backButton}>
          <div style={Utils.merge(styles.backArrow, { backgroundImage: 'url(img/back-arrow.png)'})}></div>
        </Link>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>{this.props.title}</h1>
        </div>
      </header>
    )
  }  
});

var styles = {
  header: {
    height: 60,
    background: 'white',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: 16,
    width: 30,
    cursor: 'pointer',
  },
  backArrow: {
    height: 30,
    position: 'relative',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  title: {
    textAlign: 'center',
    margin: 0,
    position: 'relative',
    left: '-50%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleContainer: {
    position: 'absolute',
    left: '50%',
    width: '80%',
    top: 10,
  }
}

module.exports = Header;

/**
 * @jsx React.DOM
 */
 
var React = require('react');
var Utils = require('../utils');

var Header = React.createClass({
  render: function() {
    return(
      <header style={styles.header}>
        <a href={'#' + document.referrer} style={styles.backButton} className={"icon icon-left-nav push-right" + (this.props.back==="true"?"":" hidden")}>
          <div style={Utils.merge(styles.backArrow, { backgroundImage: 'url(img/back-arrow.png)'})}></div>
        </a>
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
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: 16,
    width: 30,
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
  },
  titleContainer: {
    position: 'absolute',
    left: '50%',
    top: 10,
  }
}

module.exports = Header;

/** @jsx React.DOM */
var React = require('react');

var Splash = React.createClass({
  render: function() {
    return (
      <div className='page' style={styles.container} >
        <h1 style={styles.title}>Eat Or Nah</h1>

        <div style={styles.thumbs}>
          <img style={styles.thumb} src='img/thumbs-up.png' />
          <img style={styles.thumb} src='img/thumbs-down.png' />
        </div>

        <div style={styles.buttonContainer}>
          <img
            id='facebook_button'
            src='img/facebook_button.png'
            style={styles.login}
            onClick={this.props.login}
          />
        </div>
      </div>
    );
  }
});

var styles = {
  container: {
    height: '100%',
    background: '#3258ED',
  },
  title: {
    textAlign: 'center',
    fontSize: 56,
    fontFamily: 'Indie Flower',
    color: 'white',
    position: 'absolute',
    top: 75,
    zIndex: 2,
    width: '100%',
  },
  thumbs: {
    position: 'absolute',
    top: 220,
    width: '100%',
  },
  thumb: {
    width: '40%',
    margin: '5%',
  },
  buttonContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 100,
  },
  login: {
    position: 'relative',
    left: '-50%',
    width: 200,
    cursor: 'pointer',
  }
};

module.exports = Splash;

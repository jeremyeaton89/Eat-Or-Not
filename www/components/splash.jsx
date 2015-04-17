var Splash = React.createClass({
  render: function() {
    return (
      <div style={styles.container} >
        <h1 style={styles.title}>Eat Or Nah</h1>
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
    paddingTop: 100,
  },
  title: {
    textAlign: 'center',
    top: 100,
  },
  buttonContainer: {
    position: 'absolute',
    left: '50%',
    top: '75%',
  },
  login: {
    position: 'relative',
    left: '-50%',
    width: 200,
    cursor: 'pointer',
  }
};

module.exports = Splash;

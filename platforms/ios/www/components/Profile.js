/** @jsx React.DOM */
var React  = require('react');
var Auth   = require('../auth');
var Header = require('./Header');

var Profile = React.createClass({
  logout: function() {
    Firebase.unauth();
  },
  render: function() {
    return (
      <div className='page'>
        <Header title={Auth.getUser().firstName} right='home' />
        <button style={styles.logout} onClick={this.logout}>Log Out</button>
      </div>
    );
  }
});

styles = {
  logout: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },

}

module.exports = Profile;

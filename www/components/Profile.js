/** @jsx React.DOM */
var React  = require('react');
var Auth   = require('../auth');
var Header = require('./Header');

var Profile = React.createClass({
  render: function() {
    return (
      <div className='page'>
        <Header title={Auth.getUser().firstName} home='true' />
        STUFFFFF
      </div>
    );
  }
});

module.exports = Profile;

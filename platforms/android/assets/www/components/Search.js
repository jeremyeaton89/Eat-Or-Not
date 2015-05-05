/** @jsx React.DOM */
var React  = require('react');
var Auth   = require('../auth');
var Header = require('./Header');

var Search = React.createClass({
  render: function() {
    var searchHandlers = {
      keyup: this.searchByText,
      focus: this.transitionPlacesUp,
      blur:  this.transitionPlacesDown,
    };

    return (
      <div className='page'>
        <Header left='search' searchHandlers={searchHandlers} right='cancel'/>
        SEEEEARRRRRCHHHHH
      </div>
    );
  }
});

module.exports = Search;

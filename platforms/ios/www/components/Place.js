/** @jsx React.DOM */
var React = require('react');
var Header = require('./Header');

var Place = React.createClass({
  componentWillMount: function() {
    this.getPlace();
  },
  getPlace: function() {
    var service = new google.maps.places.PlacesService(window.map);
    service.getDetails({placeId: this.props.id}, function(place, status) {
      this.props.title = place.name;
      console.log('status', status, 'place', place, 'end');
    }.bind(this));
  },
  render: function() {
    return (
      <div 
        style={styles.container}
        className='page'>
        <Header title={this.props.name} back='true'/>
      </div>
    );
  }
});

var styles = {
  container: {
    background: 'white',
  },
}

module.exports = Place;

/** @jsx React.DOM */
var React         = require('react');
var Auth          = require('../auth');
var Header        = require('./Header');
var placeListItem = require('./PlaceListItem');


var Search = React.createClass({
  getInitialState: function() {
    return {
      places: [],
    };
  },
  componentWillMount: function() {

  },
  searchByText: function(e) {
    console.log('event', e, 'code', e.KeyCode, 'which', e.which, 'end');

    if (e.which == 13 || e.KeyCode == 13 && this.refs.places.getDOMNode().children.length == 1) {
      console.log('submitting!!!!');
      this.refs.places.getDOMNode().children[0].click();
      return;
    }

    var searchBar = e.target;
    this.refs.places.getDOMNode().style.top = '75px';
    if (searchBar.value.length) {
      if (this.map) {
        var request = {
          location: this.mapOptions.center,
          // radius: '500',
          types: ['restaurant', 'food'],
          name: searchBar.value,
          // query: searchBar.value + '*',
          rankBy: google.maps.places.RankBy.DISTANCE,
        };
        this.service = this.service || new google.maps.places.PlacesService(this.map);
        this.service.nearbySearch(request, function(data, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            // var places = data.map(function(place) { return place.name; })
            // console.log('places', places);
            this.parseNearbyPlaces(data, false);
          } else {
            console.log('TextSearch Error: ' + status);
          }
        }.bind(this));

        console.log('handle text: ' + searchBar.value);  
      } else {
        console.log('Map is not instantiated');
      }
    } else {
      this.getNearbyPlaces();
    }
    
  },
  render: function() {
    var searchHandlers = {
      keyup: this.searchByText,
      focus: this.transitionPlacesUp,
      blur:  this.transitionPlacesDown,
    };

    return (
      <div className='page'>
        <Header left='search' searchHandlers={searchHandlers} right='cancel'/>
        <ul>

        </ul>
      </div>
    );
  }
});

module.exports = Search;

/** @jsx React.DOM */
var React         = require('react');
var Firebase      = require('../firebase');
var Link          = require('react-router-component').Link;
var Utils         = require('../utils');
var Header        = require('./Header');
var placeListItem = require('./PlaceListItem');
var HomeMap       = require('../map');

var Home = React.createClass({
  getInitialState: function() {
    return {
      places: [],
    };
  },
  getDefaultProps: function() {
    return {      
      placeMarkers: [],
      curPosMarker: null,
      curPosition: null,
    };
  },
  componentDidMount: function() {
    this.loadMap();
  },
  loadMap: function() {    
    this.mapOptions = {
      center: {},
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        this.props.curPosition = position.coords;
        this.mapOptions.center.lat = position.coords.latitude;
        this.mapOptions.center.lng = position.coords.longitude;
        this.map = new google.maps.Map(this.refs.map.getDOMNode(), this.mapOptions);

        var svg = this.refs.svg.getDOMNode();
        var img = svg.children[0];
        svg.removeChild(img);

        var pulse = { url: 'img/puff.svg' };
        this.props.curPosMarker = new google.maps.Marker({position: this.mapOptions.center, map: this.map, icon: pulse, optimized: false,});

        this.getNearbyPlaces(null, true, this.fitBounds);
        this.addMapListeners();

      }.bind(this));
    } else {
      alert('Geolocation is not supported :(');
    }
  },
  dropPin: function(coords, key, animated) {   
    var img = {
      url: 'http://maps.google.com/mapfiles/kml/paddle/' + key + '.png',
      scaledSize: new google.maps.Size(30, 30),
    };

    var marker =  new google.maps.Marker({
      position: coords,
      map: this.map,
      icon: img,
      animation: animated ? google.maps.Animation.DROP : null,
    });      
    this.props.placeMarkers.push(marker);
    return marker; 
  },
  getNearbyPlaces: function(center, animated, callback) {      
    if (this.map && this.mapOptions && this.mapOptions.center && Utils.objLength(this.mapOptions.center)) {
      var infoWindow = new google.maps.InfoWindow();
      var request = {
        location: center ? center : this.mapOptions.center,
        types: ['restaurant', 'food'],
        rankBy: google.maps.places.RankBy.DISTANCE,
      }

      this.service = this.service || new google.maps.places.PlacesService(this.map);
      this.service.nearbySearch(request, function(res, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.parseNearbyPlaces(res, animated, callback);
        }
      }.bind(this))
    } else {
      console.warn('Google Map and mapOptions required.');
    }
  },
  fitBounds: function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.props.placeMarkers.length; i++) {
      bounds.extend(this.props.placeMarkers[i].getPosition());
    }
    this.map.fitBounds(bounds);
  },
  resetLocation: function() {
    this.map.panTo(this.props.curPosMarker.getPosition());
    this.clearPlaceMarkers();
    this.getNearbyPlaces(this.curPosition, true, function() {
      this.fitBounds();
    }.bind(this));
    this.refs.resetButton.getDOMNode().classList.add('hidden');
  },
  clearPlaceMarkers: function() {
    for (var i = 0; i < this.props.placeMarkers.length; i++) this.props.placeMarkers[i].setMap(null);
    this.props.placeMarkers = [];
  },
  searchByText: function(e) {
    var searchBar = e.target;
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
  parseNearbyPlaces: function(data, animated, callback) {
    var places = data.map(function(place) { return place.name; })
          console.log('places', places);
    if (data.length > 10) data = data.slice(0,10);
    
    this.clearPlaceMarkers();

    data.forEach(function(place, i) {
      var marker = this.dropPin(place.geometry.location, i + 1, animated);
      google.maps.event.addListener(marker, 'click', function() {
        var content = '<a id="infoWindow">' + place.name + '</a>';
        infoWindow.setContent(content);
        infoWindow.open(this.map, marker);
        var el = document.getElementById('infoWindow');
        el.addEventListener('click', function() {
          this.props.noHighlight = true;
          this.refs.places.getDOMNode().children[i].children[0].click();
        }.bind(this));
      }.bind(this));
    }.bind(this));

    var infoWindows = document.getElementsByClassName('infoWindow');
    google.maps.event.addListener(infoWindows, 'click', this.showPlace);

    var places = data.map(function(obj) {
      var url = obj.photos && obj.photos[0] ? 
        obj.photos[0].getUrl({'maxWidth': 30, 'maxHeight': 30}) : 
        'img/restaurant-icon.png';

      return {
        name: obj.name,
        imgUrl: url,
        id: obj.place_id,
      };
    });

    this.refs.subHeader.getDOMNode().style.opacity = 1;
    this.refs.hr.getDOMNode().style.opacity = 1;
    this.setState({places: places});
    if (callback) callback();
  },
  addMapListeners: function() {
    // drag
    google.maps.event.addListener(this.map, 'dragend', function(e) {
      this.getNearbyPlaces(this.map.getCenter(), false);
      var resetButton = this.refs.resetButton.getDOMNode();
      if (resetButton.classList.contains('hidden')) resetButton.classList.remove('hidden');
    }.bind(this));
    // location
    setInterval(function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        if (this.props.curPosition != position.coords) {
          this.props.curPosition = position.coords;
          var lat = position.coords.latitude,
              lon = position.coords.longitude;
          this.props.curPosMarker.setPosition(new google.maps.LatLng(lat, lon));
        }
      }.bind(this));
    }.bind(this), 10000);
  },
  highlightPlace: function(key) {
    if (!this.props.noHighlight) this.refs.places.getDOMNode().children[key].style.background = 'rgba(190, 190, 190, 0.34)';
  },
  render: function() {
    var places = this.state.places.map(function(place, i) {
      return (
        <placeListItem 
          id={place.id} 
          name={place.name} 
          imgUrl={place.imgUrl} 
          index={i}
          highlightPlace={this.highlightPlace}
        />
      );
    }.bind(this));

    return (
      <div className='page' style={styles.container}>
        <Header left='search' title='Eat Or Nah' right='profile' searchByText={this.searchByText} />
        <div ref='svg' style={styles.svgContainer}>
          <img style={styles.svg} src="img/spinning-circles.svg" />
        </div>
        <div ref='map' style={styles.map}></div>
        <div 
          ref='resetButton'
          className='hidden'
          style={styles.resetButton}
          onClick={this.resetLocation}>
          <div style={styles.resetImg}></div>
        </div>
        <h2 
          ref='subHeader'
          className='fade-in'
          style={styles.subHeader}>
          Nearby Places
        </h2>
        <hr ref='hr' className='fade-in' style={styles.hr} />
        <ul 
          style={styles.places}
          ref='places'>
          {places}
        </ul>
      </div>
    );
  }
});

var styles = {
  container: {
    background: 'white',
  },
  map: {
    width: '100%',
    height: 200,
  },
  svgContainer: {
    position: 'absolute',
    left: '50%',
    top: 145,
    zIndex: 1,
  },
  svg: {
    position: 'relative',
    width: 100,
    left: '-50%',
  },
  subHeader: {
    textAlign: 'center',
    margin: '15px 0 10px 0',
    letterSpacing: 10,
    fontSize: 15,
    fontWeight: 100,
    textTransform: 'uppercase',
    opacity: 0,
  },
  hr: {
    width: '95%',
    margin: 'auto',
    opacity: 0,
  },
  places: {
    overflow: 'auto',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  infoWindow: {
    textDecoration: 'none',
  },
  resetButton: {
    position: 'absolute',
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 30,
    right: 10,
    top: 230,
    textAlign: 'center',
    boxShadow: '3px 4px 5px #888890',
    border: '1px solid black',
    cursor: 'pointer',
  },
  resetImg: {
    backgroundImage: 'url(img/reset-icon.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: 44,
    height: 44,
    position: 'absolute',
    top: -10,
    right: -9.5,
  },
}

module.exports = Home; 

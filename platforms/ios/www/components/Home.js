/** @jsx React.DOM */
var React = require('react');
var Firebase = require('../firebase');
var Utils = require('../utils');
var Header = require('./Header');
var Link  = require('react-router-component').Link;

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
      zoom: 17,
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

        this.getNearbyPlaces(null, true);
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
  getNearbyPlaces: function(center, animated) {      
    if (this.map && this.mapOptions && this.mapOptions.center && Utils.objLength(this.mapOptions.center)) {
      var infoWindow = new google.maps.InfoWindow();
      var request = {
        location: center ? center : this.mapOptions.center,
        types: ['restaurant', 'food'],
        rankBy: google.maps.places.RankBy.DISTANCE,
      }

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, function(res, status) {
        if (status == 'OK') {
          if (res.length > 10) res = res.slice(0,10);

          res.forEach(function(place, i) {
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

          var places = res.map(function(obj) {
            var url = obj.photos && obj.photos ? 
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
        }
      }.bind(this))
    } else {
      console.warn('Google Map and mapOptions required.');
    }
  },
  addMapListeners: function() {
    // drag
    google.maps.event.addListener(this.map, 'dragend', function(e) {
      for (var i = 0; i < this.props.placeMarkers.length; i++) this.props.placeMarkers[i].setMap(null);
      this.props.placeMarkers = [];
      this.getNearbyPlaces(this.map.getCenter(), false);
    }.bind(this));
    // location
    setInterval(function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        if (this.props.curPosition != position.coords) {
          this.props.curPosition  = position.coords;
          this.props.curPosMarker.setPosition(position.coords);
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
        <li 
          style={styles.place}
          onClick={this.highlightPlace.bind(this, i)}>
          <Link 
            href={'/place/' + place.id + '/' + place.name} 
            style={styles.placeLink}>
            <span style={styles.number}>{i + 1}</span>
            <div style={Utils.merge(styles.thumbnail, { backgroundImage: 'url(' + place.imgUrl + ')'})}></div>
            <span style={styles.name}>{place.name}</span>
          </Link>
          <hr style={styles.hrItem} />
        </li>
      );
    }.bind(this));

    return (
      <div className='page' style={styles.container}>
        <Header left='search' title='Eat Or Nah' right='profile' />
        <div ref='svg' style={styles.svgContainer}>
          <img style={styles.svg} src="img/spinning-circles.svg" />
        </div>
        <div ref='map' style={styles.map}></div>
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
    height: 300,
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
    fontFamily: 'verdana',
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
  hrItem: {
    width: '90%',
    margin: 'auto',
    opacity: .5,
    position: 'relative',
    bottom: 7,
  },
  places: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  place: {
    height: 32,
    cursor: 'pointer',
  },
  placeLink: {
    textDecoration: 'none',
    color: 'black',
    display: 'inline-block',
    width: '100%',
    height: 'inherit',
    outline: 'none',
    paddingLeft: 30,
  },
  link: {
    cursor: 'pointer',
  },
  name: {
    position: 'relative',
    top: -9,
  },
  number: {
    marginRight: 10,
    position: 'relative',
    top: -9,
  },
  thumbnail: {
    height: 30,
    width: 30,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    borderRadius: 20,
    WebkitBorderRadius: 20,
    MozBorderRadius: 20,
    display: 'inline-block',
    marginRight: 10,
  },
  infoWindow: {
    textDecoration: 'none',
  },
}

module.exports = Home; 

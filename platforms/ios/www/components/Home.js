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
        this.mapOptions.center.lat = position.coords.latitude;
        this.mapOptions.center.lng = position.coords.longitude;
        this.map = new google.maps.Map(this.refs.map.getDOMNode(), this.mapOptions);

        var svg = this.refs.svg.getDOMNode();
        var img = svg.children[0];
        svg.removeChild(img);

        var img = { url: 'img/puff.svg', scaledSide: new google.maps.Size(5, 5) };
        new google.maps.Marker({position: this.mapOptions.center, map: this.map, icon: img});
        this.getNearbyPlaces();

      }.bind(this));
    } else {
      alert('Geolocation is not supported :(');
    }
  },
  dropPin: function(coords, key) {   
    var img = {
      url: 'http://maps.google.com/mapfiles/kml/paddle/' + key + '.png',
      scaledSize: new google.maps.Size(30, 30),
    };

    return new google.maps.Marker({
      position: coords,
      map: this.map,
      icon: img,
    });        
  },
  getNearbyPlaces: function() {      
    if (this.map && this.mapOptions && this.mapOptions.center && Utils.objLength(this.mapOptions.center)) {
      var infoWindow = new google.maps.InfoWindow();
      var request = {
        location: this.mapOptions.center,
        types: ['restaurant', 'food'],
        rankBy: google.maps.places.RankBy.DISTANCE,
      }

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, function(res, status) {
        if (status == 'OK') {
          if (res.length > 10) res = res.slice(0,10);

          res.forEach(function(place, i) {
            var marker = this.dropPin(place.geometry.location, i + 1);
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
          this.setState({places: places});
        }
      }.bind(this))
    } else {
      console.warn('Google Map and mapOptions required.');
    }
  },
  highlightPlace: function(key) {
    if (!this.props.noHighlight) this.refs.places.getDOMNode().children[key].style.background = 'rgba(50, 88, 237, 0.35)';
  },
  logout: function() {
    Firebase.unauth();
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
  places: {
    listStyleType: 'none',
    padding: 0,
  },
  place: {
    height: 30,
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
  logout: {
    position: 'absolute',
    top: 25,
    right: 10,
  },
}

module.exports = Home; 

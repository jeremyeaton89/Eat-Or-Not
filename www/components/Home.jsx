var Firebase = require('../firebase');
var Utils = require('../utils');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Header = require('./Header');

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
        // new GeolocationMarker(this.map);  
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
              el.addEventListener('click', this.showPlace.bind(this, i));
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
            };
          });
          this.setState({places: places});
        }
      }.bind(this))
    } else {
      console.warn('Google Map and mapOptions required.');
    }
  },
  showPlace: function(key) {
    console.log("SHOW PLACE WITH KEY " + key);
  },
  logout: function() {
    Firebase.unauth();
  },
  render: function() {
    var places = this.state.places.map(function(place, i) {
      return (
        <li 
          style={styles.place}
          onClick={this.showPlace.bind(this, i)}>

          <span style={styles.number}>{i + 1}</span>
          <div style={Utils.merge(styles.thumbnail, { backgroundImage: 'url(' + place.imgUrl + ')'})}></div>
          <span style={styles.name}>{place.name}</span>
        </li>
      );
    }.bind(this));

    return (
      <div className={'page ' + this.props.position} style={styles.container}>
        <Header title='Eat Or Nah' />
        <a href={'#place/tests'} >GO TO PLACE</a>
        <div ref='map' style={styles.map}></div>
        <button onClick={this.logout}>Logout</button>
          <ul style={styles.places} >
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
  places: {
    listStyleType: 'none',
  },
  place: {
    height: 30,
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
}

module.exports = Home; 

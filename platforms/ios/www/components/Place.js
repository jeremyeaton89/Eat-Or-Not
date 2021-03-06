/** @jsx React.DOM */
var React       = require('react');
var Firebase    = require('../firebase');
var Utils       = require('../utils');
var Header      = require('./Header');
var Auth        = require('../auth');
var PrettyImage = require('./PrettyImage');

var Place = React.createClass({
  componentWillMount: function() {
    // Check for existence of place in Firebase
    this.endpoint = Firebase.child('places/' + this.props.id);
    this.endpoint.once('value', function(snapshot) {
      var data = snapshot.val();
      if (data === null) {
        this.getPlaceDetails(function(data) {
          this.endpoint.set(data);
          this.updateUIAndProps(data);
        }.bind(this));
      } else {
        this.setState({
          likesCount: data.likesCount,
          dislikesCount: data.dislikesCount,
        });
        this.updateUIAndProps(data);
      }
    }.bind(this));
  },
  componentDidMount: function() {
    this.bindStatListeners();   
    this.checkPlace();
  },
  componentWillUnmount: function() {
    this.unbindStatListeners();
  },
  getInitialState: function() {
    return {
      likesCount:    0,
      dislikesCount: 0,
      disabled:      null,
    }
  },
  getDefaultProps: function() {
    return {
      imgUrl: 'img/restaurant-icon.png',
      website: null,
      address: null,
    };
  },
  updateUIAndProps: function(data) {
    if (data.imgUrl) { 
      this.props.imgUrl = data.imgUrl; 
      var img = this.refs.img.getDOMNode();
      img.src = data.imgUrl;
      setTimeout(function() {
        var svg = this.refs.svg.getDOMNode();
        svg.parentNode.removeChild(svg);
        img.style.opacity = 1;
      }.bind(this), 200);
    }
    if (data.website) this.props.website = data.website;
    if (data.address) {
      this.props.address = data.address;
      this.refs.address.getDOMNode().innerHTML = data.address;
    }
  },
  getPlaceDetails: function(callback) {
    var map = new google.maps.Map(document.createElement('div')); // dummy map
    new google.maps.places.PlacesService(map).getDetails({placeId: this.props.id}, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var imgUrl = place.photos && place.photos[0] ? 
                   place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) : 
                   'img/restaurant-icon.png';

        var details = {
          likesCount:    0,
          dislikesCount: 0,
          name:          this.props.name,
          address:       place.vicinity,
          website:       place.website || '',
          imgUrl:        imgUrl,
          id:            this.props.id,
        };
        callback(details);
      } else { console.log('PlaceService Error: ' + status); }
    }.bind(this))
  },
  incrLikes: function() {
    this.endpoint.child('likesCount').transaction(function(current_val) {
      return (current_val || 0) + 1;
    });
    this.addUserPlace(true);
  },
  incrDislikes: function() {
    this.endpoint.child('dislikesCount').transaction(function(current_val) {
      return (current_val || 0) + 1;
    });
    this.addUserPlace(false);
  },
  addUserPlace: function(like) {
    Auth.getUser().endpoint.child('places/' + this.props.id).set({
      name: this.props.name, 
      like: like,
      imgUrl: this.props.imgUrl,
      id: this.props.id,
      address: this.props.address,
    });

    this.setState({disabled: 'disabled'});
    like ? this.refs.thumbsDown.getDOMNode().style.opacity = 0.3:
           this.refs.thumbsUp.getDOMNode().style.opacity   = 0.3;
  },
  checkPlace: function() {
    Auth.getUser().getPlace(this.props.id, function(place) {
      if (place) {
        this.setState({disabled: 'disabled'});
        place.like ? this.refs.thumbsDown.getDOMNode().style.opacity = 0.3:
                     this.refs.thumbsUp.getDOMNode().style.opacity   = 0.3;         
      }
    }.bind(this));   
  },
  bindStatListeners: function() {
    this.endpoint.child('likesCount').on('value', function(snapshot) {
      this.setState({likesCount: snapshot.val()});
    }.bind(this));
    this.endpoint.child('dislikesCount').on('value', function(snapshot) {
      this.setState({dislikesCount: snapshot.val()});
    }.bind(this));
  },
  unbindStatListeners: function() {
    this.endpoint.child('likesCount').off('value');
    this.endpoint.child('dislikesCount').off('value');
  },
  render: function() {
    var likesString    = this.state.likesCount == 1 ? '1 like' : this.state.likesCount + ' likes';
    var dislikesString = this.state.dislikesCount == 1 ? '1 dislike' : this.state.dislikesCount + ' dislikes';

    return (
      <div className='page'>
        <Header title={this.props.name} left='back'/>

        <div style={styles.imgContainer}>
          <img 
            ref='img'
            style={styles.img} 
            className='fade'
            src=''
          />
          <div style={styles.svgContainer}>
            <img 
              ref='svg'
              src='img/three-dots.svg' 
              style={styles.svg}
            />
          </div>
          <p 
            ref='address'
            style={styles.address}>
            {this.props.address}
          </p>
        </div>

        <div style={styles.body}>
          <div style={styles.buttonContainer}>
            <div>{likesString}</div>
            <button 
              ref='thumbsUp'
              disabled={this.state.disabled}
              style={styles.button} 
              onClick={this.incrLikes}>
              <img src='img/thumbs-up.png' />
            </button>
          </div>

          <div style={styles.buttonContainer}>
            <div>{dislikesString}</div>
            <button 
              ref='thumbsDown'
              disabled={this.state.disabled}
              style={styles.button}
              onClick={this.incrDislikes}>
              <img src='img/thumbs-down.png' />
            </button>
          </div>  
        </div>

        <p style={styles.flash}>Those who liked {this.props.name} also liked THIS</p>

      </div>
    );
  }
});

var styles = {
  address: {
    width: '100%',
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    position: 'relative',
    margin: 0,
    top: 178,
  },
  flash: {
    marginTop: 10,
    textAlign: 'center',
  },
  img: {
    width: '100%',
    margin: 'auto',
    bottom: '-100%',
    top: '-100%',
    minHeight: 200,
    position: 'absolute',
    opacity: 0,
  },
  imgContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  svg: {
    position: 'relative',
    left: '-50%',
    width: '100%',
  },
  svgContainer: {
    width: '40%',
    position: 'absolute',
    left: '50%',
    top: '40%',
  },
  button: {
    outline: 'none',
    border: 'none',
    background: 'none',
    marginTop: 10,
  },
  buttonContainer: {
    width: '40%',
    display: 'inline-block',
    margin: '5px 5%',
    background: 'white',
  },
  body: {
    width: '100%',
    textAlign: 'center',
  },
}

module.exports = Place;

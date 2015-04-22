/** @jsx React.DOM */
var React    = require('react');
var Firebase = require('../firebase');
var Utils    = require('../utils');
var Header   = require('./Header');

var Place = React.createClass({
  componentWillMount: function() {
    // Check for existence of place in Firebase
    // Firebase.child('places/' + this.props.id).once('value', (snapshot) => {
    //   if (snapshot.val() === null) {
        
    //   } else {
    //     //
    //   }
    // });
  },
  getDefaultProps: function() {
    return {
      likesCount: 0,
      dislikesCount: 0,
    }
  },
  setEmptyPlace: function() {

  },
  getPlace: function() {
    var service = new google.maps.places.PlacesService(window.map);
    service.getDetails({placeId: this.props.id}, function(place, status) {
      this.props.title = place.name;
      console.log('status', status, 'place', place, 'end');
    }.bind(this));
  },
  render: function() {
    var likesString = this.props.likesCount == 1 ? '1 like' : this.props.likesCount + ' likes';
    var dislikesString = this.props.dislikesCount == 1 ? '1 dislike' : this.props.dislikesCount + ' dislikes';

    return (
      <div 
        style={styles.container}
        className='page'>
        <Header title={this.props.name} back='true'/>

        <div style={{textAlign: 'center'}}>
          <div style={styles.buttonContainer}>
            <div>{likesString}</div>
            <button style={Utils.merge(styles.button, {background: 'teal'})} >
              <img style={styles.img} src='img/thumbs-up.png' />
            </button>
          </div>

          <div style={styles.buttonContainer}>
            <div>{dislikesString}</div>
            <button style={Utils.merge(styles.button, {background: 'pink'})}>
              <img style={styles.img} src='img/thumbs-down.png' />
            </button>
          </div>  
        </div>

        <p>Those who liked {this.props.name} also liked THIS</p>

      </div>
    );
  }
});

var styles = {
  container: {
    background: 'white',
  },
  img: {
    width: 100,
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    outline: 'none',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    width: '40%',
    display: 'inline-block',
    margin: '50px 5%',
  }
}

module.exports = Place;

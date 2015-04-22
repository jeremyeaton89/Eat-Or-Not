/** @jsx React.DOM */
var React    = require('react');
var Firebase = require('../firebase');
var Utils    = require('../utils');
var Header   = require('./Header');

var Place = React.createClass({
  componentWillMount: function() {
    // Check for existence of place in Firebase
    this.endpoint = Firebase.child('places/' + this.props.id);
    this.endpoint.once('value', function(snapshot) {
      var data = snapshot.val();
      if (data === null) {
        this.endpoint.set({'likesCount': 0, 'dislikesCount': 0, 'name': this.props.name})
      } else {
        this.setState({
          likesCount: data.likesCount,
          dislikesCount: data.dislikesCount,
        })
      }
    }.bind(this));
  },
  componentDidMount: function() {
    this.bindStatListeners();
  },
  componentWillUnmount: function() {
    this.unbindStatListeners();
  },
  getInitialState: function() {
    return {
      likesCount:    0,
      dislikesCount: 0,
    }
  },
  incrLikes: function() {
    this.endpoint.child('likesCount').transaction(function(current_val) {
      return (current_val || 0) + 1;
    });
  },
  incrDislikes: function() {
    this.endpoint.child('dislikesCount').transaction(function(current_val) {
      return (current_val || 0) + 1;
    });
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
    var likesString = this.state.likesCount == 1 ? '1 like' : this.state.likesCount + ' likes';
    var dislikesString = this.state.dislikesCount == 1 ? '1 dislike' : this.state.dislikesCount + ' dislikes';

    return (
      <div 
        style={styles.container}
        className='page'>
        <Header title={this.props.name} back='true'/>

        <div style={{textAlign: 'center'}}>
          <div style={styles.buttonContainer}>
            <div>{likesString}</div>
            <button 
              style={Utils.merge(styles.button, {background: 'teal'})} 
              onClick={this.incrLikes}>
              <img style={styles.img} src='img/thumbs-up.png' />
            </button>
          </div>

          <div style={styles.buttonContainer}>
            <div>{dislikesString}</div>
            <button 
              style={Utils.merge(styles.button, {background: 'pink'})}
              onClick={this.incrDislikes}>
              <img style={styles.img} src='img/thumbs-down.png' />
            </button>
          </div>  
        </div>

        <p style={{textAlign: 'center'}}>Those who liked {this.props.name} also liked THIS</p>

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
    marginTop: 10,
  },
  buttonContainer: {
    width: '40%',
    display: 'inline-block',
    margin: '50px 5%',
  }
}

module.exports = Place;

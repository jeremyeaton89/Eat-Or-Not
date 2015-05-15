/** @jsx React.DOM */
var React = require('react');
var Utils = require('../utils');

var PrettyImage = React.createClass({
  getInitialState: function() {
    return {
      src: null,
    };
  },
  getDefaultProps: function() {
    return {
      width: '100%',
      height: 300,
      imgStyle: null,
      containerStyle: null,
    };
  },
  render: function() {
    var img;

    // if (this.state.src) {
    //   <img src=
    // } else {

    // }

    return (
      <div style={Utils.merge(styles.container, this.props.containerStyle)}>
        <img 
          src={this.state.src} 
          style={Utils.merge(styles.img, this.props.imgStyle)}/> 
      </div>
    );
  }
});

// var styles = {
//   container: {
//     width: this.props.width,
//     height: this.props.height,
//   },
//   img: {

//   },
// }

module.exports = PrettyImage;

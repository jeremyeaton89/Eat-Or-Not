/** @jsx React.DOM */
var React = require('react');
var Link  = require('react-router-component').Link;
var Utils = require('../utils');

var PlaceListItem = React.createClass({
  render: function() {
    return (
      <li 
        style={styles.place}
        onClick={this.props.highlightPlace.bind(null, this.props.index)}>
        <Link 
          href={'/place/' + this.props.id + '/' + this.props.name} 
          style={styles.placeLink}>
          <span style={styles.number}>{this.props.index + 1}</span>
          <div style={styles.thumbnailContainer}>
            <img style={styles.thumbnail} src={this.props.imgUrl}/>
          </div>
          <span style={styles.name}>{this.props.name}</span>
          <span style={styles.address}>{this.props.address}</span>
        </Link>
        <hr style={styles.hrItem} />
      </li>
    );
  }
});

var styles = {
  place: {
    height: 50,
    cursor: 'pointer',
    width: '100%',
    position: 'relative',
  },
  placeLink: {
    textDecoration: 'none',
    color: 'black',
    display: 'inline-block',
    width: '100%',
    height: 'inherit',
    outline: 'none',
    paddingLeft: 30,
    boxSizing: 'border-box',
  },
  link: {
    cursor: 'pointer',
  },
  number: {
    position: 'absolute',
    top: 15,
  },
  name: {
    position: 'absolute',
    bottom: 115,
    top: 5,
  },
  address: {
    position: 'absolute',
    left: 115,
    top: 28,
    fontSize: 10,
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    margin: 0,
    // bottom: '-100%',
    // top: '-100%',
    position: 'absolute',
  },
  thumbnailContainer: {
    margin: '0 10px 0 25px',
    width: 50,
    height: 50,
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-block',
  },
  hrItem: {
    width: '90%',
    margin: 'auto',
    opacity: .5,
    position: 'relative',
    bottom: 7,
  },
}

module.exports = PlaceListItem;

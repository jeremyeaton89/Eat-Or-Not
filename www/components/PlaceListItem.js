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
          <div style={Utils.merge(styles.thumbnail, { backgroundImage: 'url(' + this.props.imgUrl + ')'})}></div>
          <span style={styles.name}>{this.props.name}</span>
        </Link>
        <hr style={styles.hrItem} />
      </li>
    );
  }
});

var styles = {
  place: {
    height: 32,
    cursor: 'pointer',
    width: '100%',
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
  hrItem: {
    width: '90%',
    margin: 'auto',
    opacity: .5,
    position: 'relative',
    bottom: 7,
  },
}

module.exports = PlaceListItem;

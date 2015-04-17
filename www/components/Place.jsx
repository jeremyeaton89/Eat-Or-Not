var Header = require('./Header');

var Place = React.createClass({
  render: function() {
    return (
      <div 
        style={styles.container}
        className={'page ' + this.props.position}>
        <Header title='PLACE' back='true'/>
        THIS IS A PLACE VIEW
      </div>
    );
  }
});

var styles = {
  container: {
    background: 'blue',
  },
}

module.exports = Place;

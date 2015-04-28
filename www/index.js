/** @jsx React.DOM */

var React              = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Router             = require('react-router-component');
var Location           = Router.Location;
var Link               = Router.Link;
var Firebase           = require('./firebase');
var Utils              = require('./utils');
var User               = require('./user');
var Auth               = require('./auth');
var History            = require('./history');

var Splash             = require('./components/Splash');
var Home               = require('./components/Home');
var Place              = require('./components/Place');
var Profile            = require('./components/Profile');
var Search             = require('./components/Search');


var AnimatedLocations = React.createClass({
  mixins: [Router.RouterMixin, Router.AsyncRouteRenderingMixin],

  getRoutes: function() {
    return this.props.children;
  },
  render: function() {
    var handler = this.renderRouteHandler();
    var isPopState = this.state.navigation.isPopState;
    var enabled = isPopState ?
                  !!this.props.popStateTransitionName :
                  !this.state.navigation.noTransition;
    var props = {
      component: React.DOM.div,
      transitionEnter: enabled,
      transitionLeave: enabled,
    };
    if (isPopState && this.props.popStateTransitionName) {
      props.transitionName = this.props.popStateTransitionName;
    } else if (this.state.navigation.transitionName) {
      props.transitionName = this.state.navigation.transitionName;
    }

    handler.props.key = this.state.match.path;
    return this.transferPropsTo(CSSTransitionGroup(props, handler));
  }
});

var App = React.createClass({
  componentWillMount: function() {
    window.addEventListener('hashchange', function(e) {
      History.setReferrerHash(e.oldURL.split('#')[1]);
    })
  },
  render: function() {
    return (
      <AnimatedLocations hash className='main' transitionName='left'>
        <Location path='/'                handler={Home} />
        <Location path='/place/:id/:name' handler={Place} />
        <Location path='/profile'         handler={Profile} />
        <Location path='/search'          handler={Search} />
      </AnimatedLocations>
    )
  }
})

var initAuthHandler = function() {
  var container = document.getElementById('container');
  Firebase.onAuth(function(session) {
    if (session) {
      var id = session.uid.split(':')[1];
      User.fetch(id, function(user) {
        if (user) {
          Auth.setUser(user);
        } else {
          User.create(session, function(newUser) {
            Auth.setUser(newUser);
          });
        }
      });   

      React.renderComponent(<App />, container);
    } else {
      React.renderComponent(<Splash login={login} />, container);
    }
  }); 
}

var login = function(e) {
  Firebase.authWithOAuthPopup('facebook', function() {}, {
    scope: 'public_profile,user_friends'
  });
  e.preventDefault();
  e.stopPropagation();
};

window.debug = function() {
  var ul = document.getElementById('debug');

  if (!ul) {
    ul = document.createElement('ul');
    ul.id = 'debug';
    ul.style.position = 'absolute';
    ul.style.top = 0;
    document.body.appendChild(ul);
  }

  for (var i in arguments) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(arguments[i]));
    ul.appendChild(li);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initAuthHandler();
  if (typeof FastClick == 'function') FastClick.attach(document.body); 
}, false);

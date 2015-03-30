/** @jsx React.DOM */
var $ = require('jquery');
var React = require('react');
var actions = require('./actions.js');
var NamespaceFilter = require('./components/NamespaceFilter.js');
var NamespaceList = require('./components/NamespaceList.js');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var App = React.createClass({
    render: function() {
        return (
            <div className="container">
                <NamespaceFilter {...this.props} />
                <NamespaceList {...this.props} />
            </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="namespace" path=":namespace" handler={App} />
    </Route>
);

Router.run(routes, function(Handler, state) {
    React.render(<Handler routeParams={state.params}/>, document.body);
});

var pollIntervals = {
    'refreshPods': 1000,
    'refreshNamespaces': 5000
};

$.each(pollIntervals, function(actionName, timeout) {
    var actionHandler = actions[actionName];
    actionHandler();
    setInterval(actionHandler, timeout);
});
/** @jsx React.DOM */
var React = require('react');
var NamespaceStore = require('../stores/NamespaceStore.js');
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
    propTypes: {
        routeParams: React.PropTypes.object
    },

    getInitialState: function () {
        return {
            namespaces: []
        };
    },

    componentWillMount: function () {
        NamespaceStore.addChangeListener(this.update);
    },

    componentWillUnmount: function () {
        NamespaceStore.removeChangeListener(this.update);
    },

    update: function () {
        this.setState({ namespaces: NamespaceStore.getNamespaces() });
    },

    getUri: function(namespaceName) {
        return '#/' + namespaceName || '';
    },

    selectionChanged: function(event) {
        window.location = event.target.value;
    },

    render: function() {
        var selectedNs = this.props.routeParams.namespace;
        var selectedVal = this.getUri(selectedNs);

        var options = [ { name: 'All', value: '#/' } ];
        options = options.concat(this.state.namespaces.map(function(ns) {
            var nsName = ns.metadata.name;
            return { name: nsName, value: this.getUri(nsName) };
        }.bind(this)));

        var optionForSelectedNsExists = options.filter(function(opt) { return opt.name == selectedNs; }).length > 0;
        var content;
        if (!selectedNs || optionForSelectedNsExists) {
            content = (
                <select value={selectedVal} onChange={this.selectionChanged}>
                    {options.map(function(opt) { return <option key={opt.name} value={opt.value}>{opt.name}</option> })}
                </select>)
        } else {
            content = (<span>unknown namespace {selectedNs} <Link to="app">show all</Link></span>);
        }

        return (
            <div className="namespace-filter">
                <strong>Namespace: </strong>
                {content}
            </div>
        );
    }
});

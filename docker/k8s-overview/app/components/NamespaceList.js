/** @jsx React.DOM */
var $ = require('jquery');
var React = require('react');
var PodStore = require('../stores/PodStore.js');
var NamespaceStore = require('../stores/NamespaceStore.js');
var Namespace = require('./Namespace.js');

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
        PodStore.addChangeListener(this.update);
        NamespaceStore.addChangeListener(this.update);
    },

    componentWillUnmount: function () {
        PodStore.removeChangeListener(this.update);
        NamespaceStore.removeChangeListener(this.update);
    },

    update: function () {
        var namespaces = [];
        var namespacesByName = {};
        NamespaceStore.getNamespaces().forEach(function(ns) {
            var nsCopy = $.extend(true, {}, ns);
            nsCopy.pods = [];
            namespaces.push(nsCopy);
            namespacesByName[ns.metadata.name] = nsCopy;
        });

        PodStore.getPods().forEach(function(pod) {
            var ns = namespacesByName[pod.metadata.namespace];
            if (ns) {
                ns.pods.push(pod);
            }
        });

        this.setState({
            namespaces: namespaces
        });
    },

    render: function() {
        var selectedNs = this.props.routeParams.namespace;
        var namespaces = selectedNs ? this.state.namespaces.filter(function(ns) {
            return ns.metadata.name === selectedNs;
        }) : this.state.namespaces;

        return (
            <div>
                {namespaces.map(function(ns) {
                    return <Namespace key={ns.metadata.name} namespace={ns} />
                })}
            </div>
        );
    }

});

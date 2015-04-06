/** @jsx React.DOM */
var React = require('react');
var $ = require('jquery');
var Pod = require('./Pod.js');

module.exports = React.createClass({
    propTypes: {
        pods: React.PropTypes.array,
        services: React.PropTypes.array
    },

    getInitialState: function() {
        return {currentPods: [], displayedPods: [], initialized: false};
    },

    componentWillReceiveProps: function(newProps) {
        var currentPods = newProps.pods;
        var previousCurrentPods = this.state.currentPods;
        var initialized = this.state.initialized;

        var getExtraPods = function(pods, basePods, flagToAssignToPods) {
            var basePodIds = basePods.map(function(pod) { return pod.metadata.name });
            var extraPods = pods.filter(function(pod) {
                return $.inArray(pod.metadata.name, basePodIds) === -1
            });
            if (flagToAssignToPods) {
                return extraPods.map(function(pod) {
                    var copy = $.extend(true, {}, pod);
                    copy.flag = flagToAssignToPods;
                    return copy;
                });
            } else {
                return extraPods;
            }
        };

        var newPods = initialized ? getExtraPods(currentPods, previousCurrentPods, 'new') : [];
        var removedPods = initialized ? getExtraPods(previousCurrentPods, currentPods, 'removed') : [];
        var otherPods = getExtraPods(currentPods, newPods.concat(removedPods))

        this.setState({
            currentPods: currentPods,
            displayedPods: newPods.concat(removedPods, otherPods).sort(function(a, b) {
                var aCreated = Date.parse(a.metadata.creationTimestamp);
                var bCreated = Date.parse(b.metadata.creationTimestamp);
                return bCreated - aCreated;
            }),
            initialized: true
        })
    },

    getProvidedServices: function(pod) {
        return this.props.services.filter(function(service) {
            if (!service.metadata.labels) {
                return false;
            }
            for (var label in service.metadata.labels) {
                if (service.metadata.labels[label] != pod.metadata.labels[label]) {
                    return false;
                }
            }
            return true;
        });
    },

    render: function() {
        var pods = this.state.displayedPods.length > 0 ? this.state.displayedPods : this.props.pods;
        return (
            <div className="row">
                {pods.map(function(pod) {
                    var providedServices = this.getProvidedServices(pod);
                    return <Pod key={pod.metadata.uid} pod={pod} providedServices={providedServices} />
                }.bind(this))}
            </div>
        );
    }
});

/** @jsx React.DOM */
var React = require('react');
var Container = require('./Container.js');

module.exports = React.createClass({
    propTypes: {
        containers: React.PropTypes.array.isRequired
    },

    render: function(container) {
        return (
            <div className="list-group">
                {this.props.containers.map(function(container) {
                    return <Container container={container} key={container.name} />
                })}
            </div>
        );
    }
});

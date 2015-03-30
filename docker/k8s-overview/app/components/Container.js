/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
    propTypes: {
        container: React.PropTypes.object.isRequired
    },

    render: function() {
        var container = this.props.container;
        return (
            <div className="list-group-item kub8-container">
                <div className="list-group-item-header">
                    <strong>{container.name}</strong>
                </div>
                <div className="list-group-item-text">
                    {container.image}
                </div>
            </div>
        );
    }
});

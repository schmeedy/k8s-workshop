/** @jsx React.DOM */
var React = require('react');
var PodList = require('./PodList.js');

module.exports = React.createClass({
    propTypes: {
        namespace: React.PropTypes.object.isRequired
    },

    render: function() {
        var ns = this.props.namespace;
        var nsApiResource = '/api/v1beta3/namespaces/' + ns.metadata.name;
        var panelBody;
        if (ns.pods.length > 0) {
            panelBody = <PodList pods={ns.pods} services={ns.services} key={ns.metadata.id} />;
        } else {
            panelBody = <div className="row empty">Empty namespace (no Pods)</div>;
        }

        return (
            <div>
                <div className="panel panel-default bootcards-summary">
                    <div className="panel-heading">
                        <h3 className="panel-title"><a target="_blank" href={nsApiResource}>{ns.metadata.name}</a></h3>
                    </div>
                    <div className="panel-body">
                        {panelBody}
                    </div>
                </div>
            </div>
        );
    }
});

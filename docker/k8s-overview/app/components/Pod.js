/** @jsx React.DOM */
var React = require('react');
var ContainerList = require('./ContainerList.js');

module.exports = React.createClass({
    propTypes: {
        pod: React.PropTypes.object.isRequired
    },

    formatHost: function(host) {
        var dotIndex = host.indexOf('.');
        return dotIndex < 0 ? host : host.substring(0, dotIndex);
    },

    renderIcon: function(pod) {
        if (pod.metadata.labels.icon) {
            var iconSrc = pod.icon || 'http://phette23.github.io/speed-is-a-feature/img/loadingBar.gif';
            return (<img className='pod-icon' src={iconSrc} />);
        }
    },

    render: function() {
        var pod = this.props.pod;
        var podClasses = 'bootcards-summary-item pod' + (pod.flag ? ' ' + pod.flag : '');

        return (
            <div className='col-xs-6 col-sm-4 pod-container'>
                <div className={podClasses}>
                    <div className='pod-info'>{pod.metadata.name} <span className='faded'>@ {this.formatHost(pod.status.host)}</span></div>
                    <ContainerList containers={pod.spec.containers} />
                    {this.renderIcon(pod)}
                </div>
            </div>
        );
    }
});

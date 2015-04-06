/** @jsx React.DOM */
var React = require('react');
var ContainerList = require('./ContainerList.js');

module.exports = React.createClass({
    propTypes: {
        pod: React.PropTypes.object.isRequired,
        providedServices: React.PropTypes.array
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

    renderProvidedService: function(service) {
        var apiEndpoint = '/api/v1beta3/namespaces/' + service.metadata.namespace + '/services/' + service.metadata.name;
        return <span key={service.metadata.name}><a target="_blank" href={apiEndpoint}>{service.metadata.name}</a> </span>
    },

    renderProvidedServices: function() {
        if (this.props.providedServices.length > 0) {
            return <div>provides: { this.props.providedServices.map(this.renderProvidedService) }</div>
        }
    },

    render: function() {
        var pod = this.props.pod;
        var podClasses = 'bootcards-summary-item pod' + (pod.flag ? ' ' + pod.flag : '');
        var podApiResource = '/api/v1beta3/namespaces/' + pod.metadata.namespace + '/pods/' + pod.metadata.name;
        var hostApiResource = '/api/v1beta3/nodes/' + pod.status.host;

        return (
            <div className='col-xs-6 col-sm-4 pod-container'>
                <div className={podClasses}>
                    <div className='pod-info'>
                        <a target="_blank" href={podApiResource}>{pod.metadata.name}</a>
                        <span className='faded'> @ <a target="_blank" href={hostApiResource}>{this.formatHost(pod.status.host)}</a></span></div>
                    <ContainerList containers={pod.spec.containers} />
                    {this.renderIcon(pod)}
                    {this.renderProvidedServices()}
                </div>
            </div>
        );
    }
});

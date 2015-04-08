var flux = require('flux-react');
var $ = require('jquery');
var actions = require('../actions.js');

module.exports = flux.createStore({
    pods: [],
    podIcons: {},

    actions: [
        actions.refreshPods
    ],

    refreshPods: function () {
        $.get('/api/v1beta3/pods', function (pods) {
            this.pods = pods.items;
            this.pods.forEach(function(pod) {
                if (!pod.metadata.labels) {
                    pod.metadata.labels = {};
                }
                var iconPath = pod.metadata.labels.icon;
                if (iconPath) {
                    this.assignIcon(pod, iconPath);
                }
            }.bind(this));
            this.emitChange();
        }.bind(this));
    },

    assignIcon: function(pod, iconPath) {
        var podName = pod.metadata.name;
        if (this.podIcons[podName]) {
            pod.icon = this.podIcons[podName];
        } else {
            var iconUri = '/api/v1beta3/proxy/namespaces/' + pod.metadata.namespace + '/pods/' + podName + '/' + iconPath;
            $.get(iconUri, function() {
                pod.icon = iconUri;
                this.podIcons[podName] = iconUri;
                this.emitChange();
            }.bind(this));
        }
    },

    exports: {
        getPods: function() {
            return this.pods;
        }
    }
});
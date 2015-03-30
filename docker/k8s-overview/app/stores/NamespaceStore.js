var flux = require('flux-react');
var $ = require('jquery');
var actions = require('../actions.js');

module.exports = flux.createStore({
    namespaces: [],

    actions: [
        actions.refreshNamespaces
    ],

    refreshNamespaces: function () {
        $.get('/api/v1beta3/namespaces', function (namespaces) {
            this.namespaces = namespaces.items.splice(0).sort(function(ns1, ns2) {
                return ns1.metadata.name.localeCompare(ns2.metadata.name);
            });
            this.emitChange();
        }.bind(this));
    },

    exports: {
        getNamespaces: function() {
            return this.namespaces;
        }
    }
});
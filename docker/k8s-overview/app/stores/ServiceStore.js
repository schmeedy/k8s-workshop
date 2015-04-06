var flux = require('flux-react');
var $ = require('jquery');
var actions = require('../actions.js');

module.exports = flux.createStore({
    services: [],

    actions: [
        actions.refreshServices
    ],

    refreshServices: function () {
        $.get('/api/v1beta3/services', function (services) {
            this.services = services.items;
            this.emitChange();
        }.bind(this));
    },

    exports: {
        getServices: function() {
            return this.services;
        }
    }
});
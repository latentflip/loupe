var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');

var Render = AmpersandState.extend({
    props: {
        id: 'number',
        state: ['string', true, 'queued'],
    },
    initialize: function () {
        setTimeout(function () {
            this.state = 'delayed';
        }.bind(this), 20);
    }
});

module.exports = AmpersandCollection.extend({
    model: Render,

    initialize: function () {
        var id = 1;

        setInterval(function () {
            if (this.length === 0) {
                this.add({ id: id++ });
            }
        }.bind(this), 1000);
    },
    shift: function () {
        if (this.length > 0) {
            var model = this.at(0);
            setTimeout(function () {
                model.state = 'rendered';
                setTimeout(function () {
                    this.remove(model.id);
                }.bind(this), 250);
            }.bind(this), 20);
        }
    }
});

var React = require('react');
var EventsMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [
        EventsMixin
    ],

    getInitialState: function () {
        return {
            code: app.store.code
        };
    },

    registerListeners: function (props, state) {
        this.listenTo(state.code, 'callback:shifted', function () {
            var domnode = this.refs.spinner.getDOMNode();
            domnode.classList.add('spinner-wrapper-transition');
            var onTransitionEnd = function () {
                domnode.classList.remove('spinner-wrapper-transition');
                domnode.removeEventListener('transitionend', onTransitionEnd, false);
            };
            domnode.addEventListener('transitionend', onTransitionEnd, false);
        }.bind(this));
    },

    render: function () {
        return (
            <div className="spinner-wrapper" ref='spinner'>
              <div className="spinner-circle"></div>
              <div className="spinner-arrow spinner-arrow-left"></div>
              <div className="spinner-arrow spinner-arrow-right"></div>
            </div>
        );
    }
});

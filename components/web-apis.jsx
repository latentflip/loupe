var React = require('react/addons');
var WebApiTimer = require('./web-api-timer.jsx');
var WebApiQuery = require('./web-api-query.jsx');
var EventMixin = require('react-backbone-events-mixin');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
    mixins: [
        EventMixin
    ],

    registerListeners: function (props, state) {
        this.listenTo(state.apis, 'all', function () {
            this.forceUpdate();
        }.bind(this));

        this.listenTo(state.apis, 'callback:spawned', function (model) {
            this.refs[model.id].flash();
        }.bind(this));
    },

    getInitialState: function () {
        return {
            apis: app.store.apis
        };
    },

    render: function () {
        var apis = this.state.apis.map(function (api) {
            if (api.type === 'timeout') {
                return <WebApiTimer timeout={api.timeoutString} key={api.id} ref={api.id} playState={api.playState}>{api.code}</WebApiTimer>;
            }
            if (api.type === 'query') {
                return (
                    <WebApiQuery key={api.id} ref={api.id}>
                        {api.code}
                    </WebApiQuery>
                );
            }
        });

        return (
          <div className='webapis flexChild'>
            <ReactCSSTransitionGroup transitionName="tr-webapis">
              {apis}
            </ReactCSSTransitionGroup>
          </div>
        )
    }
});

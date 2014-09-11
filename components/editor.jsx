/* JSX: React.DOM */

var React = require('react');
var EventMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [
        EventMixin
    ],

    registerListeners: function (props, state) {
        var self = this;

        this.listenTo(state.code, 'change', function () {
            this.forceUpdate();
        }.bind(this));

        this.listenTo(state.code, 'node:will-run', function (id) {
            var node = self.refs.code.getDOMNode().querySelector('#node-' + id);
            node.classList.add('running');
        });

        this.listenTo(state.code, 'node:did-run', function (id) {
            var node = self.refs.code.getDOMNode().querySelector('#node-' + id);
            node.classList.remove('running');
        });
    },

    getInitialState: function () {
        return {
            code: app.store.code,
            editing: false
        };
    },

    onBlur: function () {
        var newCode = this.refs.code.getDOMNode().innerText;
        this.state.code.html = newCode;
        this.setState({ editing: false });
        //this.state.code.run();
    },

    onFocus: function () {
        this.state.code.resetEverything();
        this.setState({ editing: true });
    },

    onKeyDown: function (e) {
        if (e.keyCode === 9) {
            e.preventDefault();

            var el = this.refs.code.getDOMNode();
            var sel = window.getSelection();
            var current = el.innerText;
            var range = sel.getRangeAt(0);

            console.log(range);
            var caretPos = sel.extentOffset;
            current = current.substr(0, caretPos) + '  ' + current.substr(caretPos);
            el.innerText = current;
            //setTimeout(function () {
            //    sel.removeAllRanges();
            //    sel.addRange(range);
            //}, 0);
        }
    },

    render: function () {
        var innerHTML = this.state.editing ? this.state.code.html : this.state.code.wrappedHtml;

        return (
            <div className="editor flexChild"
                 ref="code"
                 contentEditable
                 onBlur={this.onBlur}
                 onFocus={this.onFocus}
                 onKeyDown={this.onKeyDown}
                 dangerouslySetInnerHTML={ {__html: innerHTML} }
            ></div>
        );
    }
});

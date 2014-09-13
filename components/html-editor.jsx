var React = require('react');
var AceEditor = require('./ace-editor.jsx');
var EventMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [EventMixin],

    registerListeners: function (props, state) {
        this.listenTo(state.code, 'ready-to-run', function () {
            this.setState({ editing: false });
        });

        //this.listenTo(state.code, 'change:code', function () {
        //    this.forceUpdate();
        //});
    },

    getInitialState: function () {
        return {
            editing: false,
            code: app.store.code,
        };
    },

    switchMode: function () {
        var newValue = !this.state.editing;
        this.setState({ editing: newValue });
    },

    onCodeChange: function (newCode) {
        this.state.code.htmlScratchpad = newCode;
    },

    render: function () {
        if (this.state.editing) {
            return (
              <div className="flexChild columnParent">
                <div className='editor-switch'><button onClick={this.switchMode}>Save</button></div>
                <AceEditor
                    mode="html"
                    onBlur={this.onEditBlur}
                    onCodeChange={this.onCodeChange}
                    initialValue={this.state.code.rawHtmlScratchpad}
                />
              </div>
            );
        };

        var innerHTML = { __html: this.state.code.rawHtmlScratchpad };

        return (
          <div className="flexChild columnParent">
            <div className='editor-switch'><button onClick={this.switchMode}>Edit</button></div>
            <div className='html-scratchpad flexChild' dangerouslySetInnerHTML={innerHTML}></div>
          </div>
        );
    }
});

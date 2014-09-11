var React = require('react');

var ace = require('brace');
require('brace/mode/javascript');
require('brace/mode/html');
require('brace/theme/solarized_light');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            mode: 'javascript',
            initialValue: '',
            onBlur: function () { },
            onCodeChange: function (newCode) {
                console.log('Code changed to', newCode);
            }
        };
    },
    componentDidMount: function () {
        this.editor = ace.edit(this.getDOMNode());
        this.editSession = this.editor.getSession();

        this.editor.getSession().setMode('ace/mode/' + this.props.mode);
        this.editor.setTheme('ace/theme/solarized_light');

        this.editor.focus();
        this.editor.setValue(this.props.initialValue, -1);

        this.editor.on('blur', function () {
            this.props.onCodeChange(this.editor.getValue().split('\n'));
            this.props.onBlur();
        }.bind(this));
    },

    componentWillUnmount: function () {
        this.editor.destroy();
    },

    render: function () {
        return (
            <div className="ace-editor-wrapper"></div>
        );
    }
});

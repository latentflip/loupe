/* JSX: React.DOM */

var React = require('react');

module.exports = React.createClass({
    render: function () {
        var classes = ["callback", "callback-" + this.props.state].join(' ');
        return (
            <div className={classes}>
                {this.props.children}
            </div>
        );
    }
});

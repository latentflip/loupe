var React = require('react');

module.exports = React.createClass({
    render: function () {
        var classes = "stack-item";
        if (this.props.isCallback) {
            classes += " stack-item-callback";
        }

        return (
            <div className={classes}>
                {this.props.children}
            </div>
        );
    }
});

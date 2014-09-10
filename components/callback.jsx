/* JSX: React.DOM */

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="callback callback-{this.props.state}">
                {this.props.children}
            </div>
        );
    }
});

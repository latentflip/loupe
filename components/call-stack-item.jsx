var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="stack-item">
                {this.props.children}
            </div>
        );
    }
});

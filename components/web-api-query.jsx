var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className='webapi webapi-query'>
                <div className='webapi-code'>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

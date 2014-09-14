var React = require('react');

module.exports = React.createClass({
    flash: function () {
        var el = this.getDOMNode();
        el.classList.add('tr-webapi-spawn');
        setTimeout(function () {
            el.classList.add('tr-webapi-spawn-active');
        }, 16.6);

        var fallbackTimeout = setTimeout(function () {
            try {
                onTransitionOutEnd();
                onTransitionInEnd();
            } catch (e) {
            }
        }, 1000);

        var onTransitionOutEnd = function () {
            el.classList.remove('tr-webapi-spawn');
            el.removeEventListener('transitionend', onTransitionOutEnd, false);
        };

        var onTransitionInEnd = function () {
            el.classList.remove('tr-webapi-spawn-active');
            el.removeEventListener('transitionend', onTransitionInEnd, false);
            el.addEventListener('transitionend', onTransitionOutEnd, false);
        };

        el.addEventListener('transitionend', onTransitionInEnd, false);
    },

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

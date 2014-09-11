var Router = require('ampersand-router');


module.exports = Router.extend({
    routes: {
        '?code=:code': 'code',
        '': 'default'
    },

    code: function (code) {
        app.store.code.decodeUriSource(code);
    },
    default: function (code) {
        this.redirectTo("?code=Y29uc29sZS5sb2coIkhlbGxvLCB3b3JsZCEiKTsgIAo%3D");
    }
});

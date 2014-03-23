var $ = window.$ = require('jquery');
var Timeouts = require('./models/timeouts');
var MainView = require('./views/main');

var boot = function () {
    var app = {};
    window.app = app;

    $(function () {
        var mainView = window.mainView = new MainView();
        $('body').append(mainView.render().el);
    });
};

//Boot!
boot();
//module.exports = 

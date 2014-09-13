var React = require('react/addons');
window.React = React;
var App = require('./components/app.jsx');
var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');
var deval = require('deval');

var CallStack = require('./models/callstack');

var Code = require('./models/code');
var Apis = require('./models/apis');
var CallbackQueue = require('./models/callback-queue');


var Router = require('./router');

window.app = {};

window.app.router = new Router();

window.app.store = {
    callstack: new CallStack(),
    code: new Code(),
    apis: new Apis(),
    queue: new CallbackQueue()
};

app.store.code.on('change:codeLines', function () {
});

app.store.code.on('change:encodedSource', function () {
    app.router.navigate('?code=' + app.store.code.encodedSource);
});

//app.store.code.on('all', function () {
//    console.log('Code event', arguments);
//});

app.store.code.on('node:will-run', function (id, source, invocation) {
    app.store.callstack.add({
        _id: id,
        code: source
    });
});

app.store.code.on('node:did-run', function (id, invocation) {
    app.store.callstack.pop();
    //app.store.callstack.remove(app.store.callstack.at(app.store.call
    //app.store.callstack.remove(id + ':' + invocation);
});

app.store.code.on('webapi:started', function (data) {
    app.store.apis.add(data, { merge: true });
});

app.store.code.on('callback:shifted', function (id) {
    var callback = app.store.queue.get(id);
    if (!callback) {
        callback = app.store.apis.get(id);
    }

    app.store.callstack.add({
        id: callback.id.toString(),
        code: callback.code,
        isCallback: true
    });
    app.store.queue.remove(callback);
});

app.store.code.on('callback:completed', function (id) {
    app.store.callstack.remove(id.toString());
});

app.store.code.on('callback:spawn', function (data) {
    var webapi = app.store.apis.get(data.apiId);

    if (webapi) {
        webapi.trigger('callback:spawned', webapi);
    }
    app.store.queue.add(data);
});

app.store.apis.on('callback:spawn', function (data) {
    app.store.queue.add(data);
});

app.store.code.on('reset-everything', function () {
    app.store.queue.reset();
    app.store.callstack.reset();
    app.store.apis.reset();
});


//app.store.apis.add([
//    { id: '1', type: 'timeout', timeout: 5000, code: "foo();" },
//    { id: '2', type: 'timeout', timeout: 10000, code: "bar();" }
//]);
if (window.location.origin.match('latentflip.com')) {
    window.app.router.history.start({ pushState: true, root: '/loupe/' });
} else {
    window.app.router.history.start({ pushState: true });
}

React.renderComponent(App(), document.body);

var React = require('react/addons');
window.React = React;
var App = require('./components/app.jsx');
var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');
var deval = require('deval');

var CallStack = AmpersandCollection.extend({
});

var Code = require('./models/code');
var Apis = require('./models/apis');
var CallbackQueue = require('./models/callback-queue');

var initialCode = deval(function () {
var foo, bar;
function foo () {
    console.log('Hi!');
}

function bar () {
    console.log('there');
    console.log('there');
    console.log('there');
}

setTimeout(foo, 4000);
setTimeout(foo, 1000);
setTimeout(bar, 250);
});

window.app = {};

window.app.store = {
    callstack: new CallStack(),
    code: new Code({ html: initialCode }),
    apis: new Apis(),
    queue: new CallbackQueue()
};

app.store.code.on('all', function () {
    console.log('Code event', arguments);
});

app.store.code.on('node:will-run', function (id, source) {
    app.store.callstack.add({
        id: id, code: source
    });
});

app.store.code.on('node:did-run', function (id) {
    app.store.callstack.remove(id);
});

app.store.code.on('webapi:started', function (data) {
    console.log(data);
    app.store.apis.add(data, { merge: true });
});

app.store.code.on('callback:shifted', function (id) {
    var callback = app.store.queue.get(id);
    if (!callback) {
        callback = app.store.apis.get(id);
    }

    app.store.callstack.add({
        id: callback.id,
        code: callback.code
    });
    app.store.queue.remove(callback);
});

app.store.code.on('callback:completed', function (id) {
    app.store.callstack.remove(id);
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

React.renderComponent(App(), document.body);

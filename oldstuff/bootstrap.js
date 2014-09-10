function code () {
    var emitter = {};
    emitter.emit = function (name/*, args...*/) {
        var args = Array.prototype.slice(arguments, 1);
        postMessage(JSON.stringify({ name: name, args: args }));
    };
}

console.log(code.toString().slice();

module.exports = code;

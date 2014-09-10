module.exports.o = function open (tagName, attrs) {
    attrs = attrs || {};

    attrs = Object.keys(attrs).map(function (attr) {
        return attr + '="' + attrs[attr] + '"';
    }).join(' ');
    return "<" + tagName + " " + attrs + ">";
};

module.exports.c = function close (tagName) {
    return "</" + tagName + ">";
};

module.exports.w = function wrap (tagName, str, attrs) {
    return open(tagName, attrs) + str + close(tagName);
};

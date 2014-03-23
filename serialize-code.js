var min = function (arr) {
    return Math.min.apply(Math, arr);
};

module.exports = function (fn) {
    var str = fn.toString();
    str = str.replace(/function[^{]*{/, '');
    var closingBraceIdx = str.lastIndexOf('}');
    if (closingBraceIdx > 0) {
        str = str.slice(0, closingBraceIdx - 1);   
    }

    var lines = str.split('\n');
    if (lines[0].trim() === '') {
        lines.shift();
    }
    if (lines[lines.length - 1].trim() === '') {
        lines.pop();
    }
    
    var indent = min(lines.map(function (line) {
        return line.match(/^\s*/)[0].length;
    }));

    lines = lines.map(function (line) {
        return line.slice(indent);
    });
    return lines.join('\n');
};

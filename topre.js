module.exports = function (text) {
    return text.replace(/\t/g, '    ')
           .replace(/  /g, '&nbsp; ')
           .replace(/  /g, ' &nbsp;')
           .replace(/\r\n|\n|\r/g, '<br />');
};

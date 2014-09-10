module.exports = TextCursor;

function TextCursor (code) {
    this.lines = [null].concat(code.split('\n'));

    this.cursor = {
        line: 1,
        column: 0
    };
}

TextCursor.prototype.stepTo = function (line, column) {
    if (line === 'end') {
        line = this.lines.length - 1;
    }
    if (!column && typeof line === 'object') {
        column = line.column;
        line = line.line;
    }
    var output = '';
    var currentSlice;
    
    //If we're going to a different line, grab the remainder of all
    //preceeding lines
    while (this.cursor.line < line) {
        currentSlice = this.lines[this.cursor.line].slice(this.cursor.column);
        //if (currentSlice.length) output += currentSlice + '\n';
        output += currentSlice + '\n';
        this.cursor.line++;
        this.cursor.column = 0;
    }

    //Grab from where we are on the line we're jumping to, to the desired
    //column
    currentSlice = this.lines[this.cursor.line].slice(this.cursor.column, column);
    if (currentSlice.length) output += currentSlice;

//    slice = lines[cursor.line].slice(cursor.column, pos.column);
//    if (slice.length) output += slice;
    if (this.lines[this.cursor.line].length <= column) output += '\n';
    this.cursor.column = column;
    return output;
};

//var cursor = {
//    line: 1,
//    column: 0
//};
//
//var piecesToPosition = function (pos) {
//    var output = '';
//    var slice;
//    while(cursor.line < pos.line) {
//        slice = lines[cursor.line].slice(cursor.column);
//        if (slice.length) output += slice + '\n';
//        cursor.line++;
//        cursor.column = 0;
//    }
//    slice = lines[cursor.line].slice(cursor.column, pos.column);
//    if (slice.length) output += slice;
//    if (lines[cursor.line].length === pos.column) output += '\n';
//    cursor.column = pos.column;
//    return output;
//};

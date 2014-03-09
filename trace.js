var esprima = require('esprima');
var codegen = window.escodegen;
var _ = require('underscore');
var colors = require('./colseq').createSequence();
var topre = require('./topre');

var LOOP_DELAY = 1000000;
var TARGET_LOOP_DELAY = 500;

(function () {
    var a = new Date().getTime();
    (function () {
        for (var i=0; i<LOOP_DELAY; i++) { void (Math.pow(2*20)); }
    })();
    var b = new Date().getTime();
    LOOP_DELAY = LOOP_DELAY * (TARGET_LOOP_DELAY / (b-a));
})();


//window.console.log = window.console.log;
//window.console.log = function () {
//    var output = document.querySelector('#console');
//    var args = Array.prototype.slice.call(arguments);
//    output.innerHTML = output.innerHTML + "\n" + args.join("\n");
//};


function go () {
    var code = document.querySelector('#code').innerText;
    console.log(code);
    var ast = esprima.parse(code, { loc: true, range: true });

    colorCode(code, ast);
    console.log(ast);
}

function colorCode (code, ast) {
    var div = document.querySelector('#colored');
    var instrumentedDiv = document.querySelector('#instrumented');
    var lines = code.split('\n');
    lines.unshift('');
    var output = '';
    var instrumented = '';

    var cursor = {
        line: 1,
        column: 0
    };

    var piecesToPosition = function (pos) {
        var output = '';
        var slice;
        while(cursor.line < pos.line) {
            slice = lines[cursor.line].slice(cursor.column);
            if (slice.length) output += slice + '\n';
            cursor.line++;
            cursor.column = 0;
        }
        slice = lines[cursor.line].slice(cursor.column, pos.column);
        if (slice.length) output += slice;
        if (lines[cursor.line].length === pos.column) output += '\n';
        cursor.column = pos.column;
        return output;
    };

    var walkTree = function (ast, beforeChildren, afterChildren) {
        var _id = ++id;
        beforeChildren(ast, _id);
        if (ast.body) {
            if (_.isArray(ast.body)) {
                _.each(ast.body, function (expr) {
                    walkTree(expr, beforeChildren, afterChildren);
                });
            } else {
                walkTree(ast.body, beforeChildren, afterChildren);
            }
        }

        if (ast.expression) {
            //walkTree(ast.expression, beforeChildren, afterChildren);

            if (ast.expression.arguments) {
                _.each(ast.expression.arguments, function (arg) {
                    walkTree(arg, beforeChildren, afterChildren);
                });
            }
        }
        afterChildren(ast, _id);
    };

    var id = 0;
    var slow = '\n(function () { for (var i=0; i<' + LOOP_DELAY + '; i++) { void (Math.pow(2*20)); }; })();\n';

    walkTree(
        ast,
        function (expr, id) {
            console.log(expr);
            var startPieces = piecesToPosition(expr.loc.start);
            var spanOpen = '<span id="expr-' + (id) + '" data-color="' + colors.next() + '">';
            output += topre(startPieces) + spanOpen;

            if (expr.type === 'BlockStatement') {
                
            }

            instrumented += startPieces;
            if (expr.type === 'ExpressionStatement') {
                //instrumented += '\n// ------' + id + '-------' + expr.type +'\n';
                instrumented += '\npostMessage("on:' + id + '");';
                instrumented += slow;
            }
            //console.log('start', expr, '!'+startPieces+'$');
            //if (startPieces.length) {
            //    startPieces[0] = spanOpen + startPieces[0];
            //    output = output.concat(startPieces);
            //} else {
            //    output.push( spanOpen );
            //}
        },
        function (expr, id) {
            var endPieces = piecesToPosition(expr.loc.end);
            var spanClose = '</span>';
            output += topre(endPieces) + spanClose;

            instrumented += endPieces;
            if (expr.type === 'ExpressionStatement') {
                //instrumented += '\n// ------/' + id + '-------\n';
                instrumented += slow;
                instrumented += '\npostMessage("off:' + id + '");';
            }
        }
    );

    //output = output.concat(piecesToPosition(ast.loc.end));

    div.innerHTML = output.replace(/\n/g, '<br>');
    instrumentedDiv.innerHTML = instrumented;
    bootstrap = document.querySelector('#bootstrap').innerText;
    _.defer(function () {
        var blob = new Blob([bootstrap + ';\n' + instrumented], { type: 'application/javascript' });
        var worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = function (msg) {
            if (msg.data.debug) return console.log(msg.data.debug);
            msg = msg.data.split(':');
            var action = msg[0];
            var id = msg[1];
            var el = document.querySelector('#expr-' + id);
            if (action === 'on') el.style.background = el.getAttribute('data-color');
            else el.style.background = '';
        };

        document.querySelector('button').addEventListener('click', function () {
            console.log('Post!');
            worker.postMessage({
                sel: 'button',
                event: 'click',
                eventData: {}
            });
        });

    });


    //$('button').on('click', function () {
    //    console.log('Hello');
    //});
    //
}

go();

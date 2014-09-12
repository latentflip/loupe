/* JSX: React.DOM */

var React = require('react');
var CallStack = require('./call-stack.jsx');
var EventLoopSpinner = require('./event-loop-spinner.jsx');
var WebApis = require('./web-apis.jsx');
var Editor = require('./editor.jsx');
var CallbackQueue = require('./callback-queue.jsx');
var HTMLEditor = require('./html-editor.jsx');

module.exports = React.createClass({
    render: function () {
        return (
          <div className='flexContainer'>
            <div className="flexChild rowParent">

              <div className="flexChild columnParent codeColumn">
                <div className="flexChild columnParent editorBox">
                  <Editor/>
                </div>

                <div className="flexChild columnParent htmlEditorBox">
                  <HTMLEditor/>
                </div>
              </div>

              <div className="flexChild columnParent">
                <div className="flexChild rowParent stackRow">
                  <div className="stackBox columnParent">

                    <CallStack />

                    <EventLoopSpinner />
                  </div>

                  <div className="flexChild columnParent">
                    <WebApis/>
                  </div>
                </div>

                <div className="flexChild callbackRow columnParent">
                  <CallbackQueue />
                </div>
              </div>
            </div>
          </div>
        )
    }
});

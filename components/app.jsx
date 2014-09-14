/* JSX: React.DOM */

var React = require('react');
var CallStack = require('./call-stack.jsx');
var EventLoopSpinner = require('./event-loop-spinner.jsx');
var WebApis = require('./web-apis.jsx');
var Editor = require('./editor.jsx');
var CallbackQueue = require('./callback-queue.jsx');
var HTMLEditor = require('./html-editor.jsx');
var SettingsPanel = require('./settings-panel.jsx');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            settingsOpen: false
        };
    },
    toggleSettings: function () {
        this.setState({
            settingsOpen: !this.state.settingsOpen
        });
    },
    render: function () {
        return (
          <div>
            <div className='flexContainer'>
              <nav className="top-nav">
                <button className='settings-button' onClick={this.toggleSettings}>⚒</button>
                <h1>loupe</h1>
              </nav>
              <div className="flexChild rowParent">
                <SettingsPanel open={this.state.settingsOpen}/>

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
          </div>
        )
    }
});

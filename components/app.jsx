/* JSX: React.DOM */

var React = require('react');
var CallStack = require('./call-stack.jsx');
var EventLoopSpinner = require('./event-loop-spinner.jsx');
var WebApis = require('./web-apis.jsx');
var Editor = require('./editor.jsx');
var CallbackQueue = require('./callback-queue.jsx');
var RenderQueue = require('./render-queue.jsx');
var HTMLEditor = require('./html-editor.jsx');
var SettingsPanel = require('./settings-panel.jsx');
var EventMixin = require('react-backbone-events-mixin');
var Modal = require('react-modal');

module.exports = React.createClass({
    mixins: [EventMixin],

    getInitialState: function () {
        var showRenderQueue = window.location.search.match(/show-renders/);

        return {
            settingsOpen: false,
            code: app.store.code,
            modalOpen: true
        };
    },

    openModal: function () {
        this.setState({ modalOpen: true });
    },

    closeModal: function () {
        this.setState({ modalOpen: false });
    },

    registerListeners: function (props, state) {
        this.listenTo(state.code, 'change:simulateRenders', function () {
            this.forceUpdate();
        }.bind(this));
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
                <a className='modal-button' onClick={this.openModal}>help</a>
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
                    { this.state.code.simulateRenders ? <RenderQueue /> : null }
                    <CallbackQueue />
                  </div>
                </div>
              </div>
            </div>

            <Modal
                isOpen={this.state.modalOpen}
                onRequestClose={this.closeModal}>

                <a className="modalClose" onClick={this.closeModal}>close</a>

                <h1>Loupe</h1>
                <h2>Intro</h2>
                <p>Loupe is a little visualisation to help you understand how JavaScript's call stack/event loop/callback queue interact with each other.</p>
                <p>The best thing to do to understand how this works is watch this video, then when you are ready, <a onClick={this.closeModal}>go play!</a></p>
                <iframe width="444" height="250" src="//www.youtube.com/embed/8aGhZQkoFbQ" frameBorder="0" allowFullScreen></iframe>
                <h2>Instructions</h2>
                <ul>
                    <li>Write some code in the text editor on the left.</li>
                    <li>Hit the save-and-run button and watch it run.</li>
                    <li>You can create html elements in the gray box at the bottom left by hitting the edit button.</li>
                    <li>Listen for DOM events on them with <pre>$.on("button", "click", function () {'{'} console.log("hello") {'}'}</pre></li>
                    <li>Hit the tool icon at the top left to open a menu with extra settings.</li>
                    <li>Need more help? Ping <a href="http://twitter.com/philip_roberts">@philip_roberts</a> on twitter.</li>
                </ul>

                <h2>How does this work?</h2>
                <ul>
                    <li>Loupe runs entirely in your browser.</li>
                    <li>It takes your code.</li>
                    <li>Runs it through esprima, a JS parser.</li>
                    <li>Instruments it a bunch so that loupe knows where function calls, timeouts, dom events, etc happen.</li>
                    <li>Adds a whole bunch of while loops everywhere to slow down the code as it runs.</li>
                    <li>This modified code is then turned back into JavaScript and sent to a webworker (in your browser) which runs it.</li>
                    <li>As it runs, the instrumentation sends messages to the visualisation about what is going on so it can animate things at the right time.</li>
                    <li>It also has some extra magic to make dom events, and timers work properly.</li>
                </ul>

                <p className="info"><em>Built by <a href="http://github.com/latentflip">Philip Roberts</a> from <a href="http://andyet.com">&amp;yet</a>. Code is on <a href="https://github.com/latentflip/loupe">github</a></em>.</p>

                <p className="info">Got it? <a onClick={this.closeModal}>Close this dialog</a></p>
            </Modal>
          </div>
        )
    }
});

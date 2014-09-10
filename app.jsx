/* JSX: React.DOM */

var React = require('react');

module.exports = React.createClass({
  <div class='flexContainer'>
    <div class="flexChild rowParent">

      <div class="flexChild columnParent codeColumn">
        <div class="flexChild columnParent editorBox">
          <div class="editor flexChild" contenteditable>function () {

  }</div>
        </div>

        <div class="flexChild columnParent">
          <div class="flexChild html-scratchpad">
            <button>Hello</button>
          </div>
        </div>
      </div>

      <div class="flexChild columnParent">
        <div class="flexChild rowParent stackRow">
          <div class="flexChild stackBox">
            <div class="stack">
              <div class="stack-item">
                foo();
              </div>

              <div class="stack-item">
                bar();
              </div>

              <div class="stack-item">
                baz();
              </div>
            </div>
            <div class="spinner-wrapper">
              <div class="spinner-circle"></div>
              <div class="spinner-arrow spinner-arrow-left"></div>
              <div class="spinner-arrow spinner-arrow-right"></div>
            </div>
          </div>

          <div class="flexChild">
            <div class='webapi-timer'>
              <div class="webapi-code">
                setTimeout(foo);
              </div>
              <div class="stopwatch-wrapper">
                <div class="stopwatch-spinner stopwatch-pie"></div>
                <div class="stopwatch-filler stopwatch-pie"></div>
                <div class="stopwatch-mask"></div>
              </div>
            </div>

            <div class='webapi-timer'>
              <div class="webapi-code">
                setTimeout(foo);
              </div>
              <div class="stopwatch-wrapper">
                <div class="stopwatch-spinner stopwatch-pie"></div>
                <div class="stopwatch-filler stopwatch-pie"></div>
                <div class="stopwatch-mask"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="flexChild callbackRow">
          <div class="callback-queue">
            <div class="callback callback-active">window.addEventListener(foo);</div>
            <div class="callback callback-active">setTimeout(foo);</div>
            <div class="callback callback-queued">setTimeout(bar);</div>
          </div>
        </div>
      </div>
    </div>
  </div>
    
});

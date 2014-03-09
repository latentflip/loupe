var $ = function (sel) {
  return {
    on: function (event, cb) {
      addEventListener('onmessage', function (e) {
        var data = e.data;
        if (e.data.sel === sel && e.data.event === event) {
          cb(e.data.eventData);
        }
      });
    }
  };
};


$('button').on('click', function () {
    console.log('Hello');
});

[].forEach(function () {
  console.log('hi');
});

function onEach (el) {
  console.log(el);
}

function a (array) {
  console.log('Listing array');
  array.forEach(onEach);
}
console.log('2');
console.log('3');

a(1,2,3]);

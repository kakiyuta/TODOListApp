window.myApp = {};

window.myApp.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.myApp.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

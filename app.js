var app = require('express')();
var Load = require('ractive-load');

app.use(require('express').static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  Load('views/index.html').then(function(Component) {
    var ractive = new Component({
      data: {}
    });
    res.send(ractive.toHTML());
  }).catch(function(a, b) {
    console.log(a, b)
  });
});

app.listen(1337);

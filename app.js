var app = require('express')();
var bodyParser = require('body-parser');
var Load = require('ractive-load');
var mongojs = require('mongojs');

var db = mongojs('localhost', ['diabeaters']);

app.use(require('express').static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false}));

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

app.get('/scores/', function(req, res){
	console.log("scores");
	var limit = req.query.limit || 10;

	//get top scores
	db.collection('scores').find({}).limit(limit, function(err, result){
		console.log(err, result);
		if(err) return res.sendStatus(500);

		res.send(result);
	});
});

app.post('/scores/', function(req, res){
	//score record = name + score
	var score = req.body.score;
	var name = req.body.name;

	//TODO: do some validation here!

	db.collection('scores').insert({
		score: score,
		name: name,
	}, function(err){
		console.log(err);
		if(err) return res.sendStatus(500);

		res.sendStatus(201);
	});
});

app.listen(1337);

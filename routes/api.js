var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs')

var xmlparser = require('express-xml-bodyparser');
var xml2js = require('xml2js');
var o2x = require('object-to-xml');


router.get('/', function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404);
	res.send('My amazing API');
});

router.post('/SayHello', function(req, res){
	//var filepath = path.join(__dirname, '../dummies/hello.json')
	//res.sendFile(filepath);
	var name = req.body.name;
    let raw_data = fs.readFileSync('./dummies/hello.json');
    let greeting = JSON.parse(raw_data);
    greeting.date = new Date();
    greeting.message = 'Hello ' + name;
    res.send(greeting);
	//res.send('Hello World.');
});

router.get('/SayBye', function(req, res, next) {
    var name = req.query.name;
    res.send('Bye ' + name);
});

router.get('/GetFavouriteComic', function(req, res, next) {
	var item = {
		'?xml version=\"1.0\" encoding=\"iso-8859-1\"?' : null,
		"comic" : {
			"title" : "Calvin and Hobbes",
			"author" : "unknown"
		}
	};
	item.comic.author = "Bill Watterson";
	res.setHeader('Content-Type', 'application/xml');
	res.send(o2x(item));
});

router.get('/GetFavouriteColour', function(req, res, next) {
	let raw_data = fs.readFileSync('./dummies/color.xml');
	var parseString = xml2js.parseString;
    parseString(raw_data, function(err, result){
    	body = result;
    });
    res.send("Your favourite colour is " + body.color);
});

router.post('/StoreFavouriteGame', xmlparser({trim: false, explicitArray: false}), function(req, res, next) {
	// set header -> Content-Type: text/xml
	//console.log(req.body);
    var parseString = xml2js.parseString;
    parseString(req.body, function(err, result){
    	body = result;
    });
    res.send(req.body.game.name + " stored");	  
});


module.exports = router;
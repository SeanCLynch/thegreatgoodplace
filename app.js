// ======================
// The Great Good Place |
// ======================

// Core
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.json');
// DB
var Redis = require('ioredis');
// Utils
var util = require('util');
var fs = require('fs');
var marked = require('marked');
// Middleware
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
// add csurf (XSRF protection)

// =======
// Setup |
// =======

// Set up template engine
app.set('view engine', 'ejs');

// Set up express middleware
app.use(cookieParser(config.cookieParserSecret));
app.use(cookieSession({
	name: 'GGPcookie',
	keys: ['un','color','lat','long'],
	expires: new Date(Date.now() + 86400000) // +1 day
}));
app.use(bodyParser.json());
app.use("/public", express.static(__dirname + '/public'));
app.use(morgan('dev'));

var usersDB = new Redis();
var placesDB = new Redis();

// ==================
// Data(Base) Setup |
// ==================

// The User Object
// var newUser = new User({a:"blah", b:"meh", ... });
function User(name, lat, long, color, place) {
	this.username = name;
	this.lat = lat;
	this.long = long;
	this.color = color;
	this.lastPlace = place;
	// Status (owner, etc)
	// Link / Contribution
}

// The Place Object
function Place(name, lat, long, radius, color) {
	this.name = name;
	this.lat = lat;
	this.long = long;
	this.radius = radius;
	// Opacity
	// Fill Opacity
	// Weight
	this.color = color;
}

// RESTful JSON API for website and apps.
// Needs authentication, input sanitatiion, etc.
var apiRouter = express.Router();

// Create a new user
apiRouter.put('/user/add', function (req, res) {
	usersDB.hmset(username, 'username', username,
							'lat', lat,
							'long', long,
							'color', color,
							'lastPlace', lastPlace,
							'status', status,
							'link', link);
	res.json(user);
});

// Retrieve the current user, if any
apiRouter.get('/user', function (req, res) {
	if (req.session.isPopulated) {
		res.json({
			username: req.session.un,
			color: req.session.color
		});
	} else {
		res.json({ username: "Guest" });
	}
})

// Retrieve a specific user
apiRouter.get('/user/:username', function (req, res) {
	var user = usersDB.hgetall(req.params.username);
	// need to manipulate user into json format here?
	res.json(user);
});

// Create a new place
apiRouter.put('/place/add', function (req, res) {
	placesDB.hmset(name, 	'name', name,
							'lat', lat,
							'long', long,
							'radius', radius,
							'opacity', opacity,
							'weight', weight,
							'color', color,
							'size', size);
	res.json(place);
});

// Retrieve a place
apiRouter.get('/place/:name', function (req, res) {
	res.json({ title: req.params.name });

	// var place = placesDB.hgetall(req.params.name);
	// need to manipulate user into json format here?
	// res.json(place);
});

app.use('/api', apiRouter);

// This is holding the place of an actual database/document based storage. Still.
var places = { circles: [
	{ lat: 39.952200,long: -75.193249,radius: 5000,opacity: 1,fillOpacity: 0.3,weight: 1},
	{ lat: 40.009299,long: -75.304822,radius: 5000,opacity: 1,fillOpacity: 0.3,weight: 1},
	{ lat: 39.906057,long: -75.166492,radius: 2500,opacity: 1,fillOpacity: 0.3,weight: 1}
], feats: { type: 'FeatureCollection', "features": [
	{
		type: 'Feature',
		"geometry": {
			type: "Point",
			coordinates: [-75.193249, 39.952200]
		},
		"properties": {
			title: "SeansPub",
			description: "2 Users Here",
			radius: 5000,
			'marker-size': 'medium',
			'marker-color': '#BE9A6B',
			'marker-symbol': 'building'
		}
	},
	{
		type: 'Feature',
		"geometry": {
			type: "Point",
			coordinates: [-75.304822, 40.009299]
		},
		"properties": {
			title: "Allstons\'s Place",
			description: "6 Users Here",
			radius: 5000,
			'marker-size': 'medium',
			'marker-color': '#BE9A6B',
			'marker-symbol': 'building'
		}
	},
	{
		type: 'Feature',
		"geometry": {
			type: "Point",
			coordinates: [-75.166492, 39.906057]
		},
		"properties": {
			title: "Phillies Stadium",
			description: "600 Users Here",
			radius: 2500,
			'marker-size': 'medium',
			'marker-color': '#BE9A6B',
			'marker-symbol': 'building'
		}
	}
]}
};

// ==========
// Main App |
// ==========

app.get('/', function(req, res) {
	var indexData = { name: '' };
	if (req.session.isNew) {
		console.log("New User");
		indexData.name = 'guest';
	} else {
		console.log("Welcome back", req.session.un);
		indexData.name = req.session.un;
	}
	res.render('index', indexData);
	// res.sendFile(__dirname+'/entrance.html'); // was door.html
});

app.get('/login', function(req, res) {
	if (req.session.isPopulated) {
		// Update session
		console.log("Updating Session", req.session.un);
		req.sessionOptions.expires = new Date(Date.now() + 86400000) // +1 day
	} else {
		// Create a new session
		console.log("Creating New Session");
		console.log(util.inspect(req.query));
		req.session.un = req.query.name;
		req.session.lat = req.query.lat;
		req.session.long = req.query.long;
		req.session.color = req.query.color;
	}
	res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.session = null; // delete the current session
	res.redirect('/');
});

app.get('/getPlaces', function(req, res) {
	res.json({
		places: places, // needs to query database
		user: {
			long: req.session.long,
			lat: req.session.lat,
			un: req.session.un,
			color: req.session.color
		},
		config: {
			MBAccessToken: config.mapbox.accessToken,
			MBMapId: config.mapbox.mapCode
		}
	});
})

app.get('/p/:place', function(req, res) {
	var insideData = { name: req.params.place }
	res.render('inside', insideData);
	// res.send(req.params.place);
});

// app.post('/pusher/auth', function(req, res) {
// 	res.send("1451943tyfhu3qihrw-8139h4f-9qhf");
// });

// =========================
// Personal Website Router |
// =========================

var personalSiteRouter = express.Router();

personalSiteRouter.get('/', function(req, res) {
	res.render('website/personalsite');
});

var edata = require('./essayList.json');
personalSiteRouter.get('/essays', function(req, res) {
	res.render('website/essaylist', edata);
});

personalSiteRouter.get('/essays/:eslug', function(req, res) {
	var slug = req.params.eslug;
	var path = __dirname + '/public/essays/' + slug + '.md';
	var file = fs.readFileSync(path, 'utf8');
	var html = marked(file);
	res.render('website/essay', {"md": html} );
});

// only requests to /bartender/* will be sent to personalSiteRouter
app.use('/bartender', personalSiteRouter);

// =========
// Sockets |
// =========

var usernames = {};
var rooms = [];

io.on('connection', function (socket) {
	console.log('A user connected.');

	// First, we must join the approriate room.
	socket.on('join', function (room) {
		console.log('A user joined', room);
		// Is available?
		socket.join(room);
		socket.broadcast.to(room).emit('roomMsg', '>>>', 'A user joined this room.');
	});

	socket.on('roomMsg', function (room, user, msg) {
		socket.broadcast.to(room).emit('roomMsg', user, msg);
	});

	socket.on('disconnect', function () {
		console.log('A user disconnected.');
	});
});

// ==============
// Misc. Utils. |
// ==============

// Handle any actual errors.
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Handle any 404 responses.
app.use(function (req, res, next) {
	res.status(404).send("404 - Page Not Found.");
})

http.listen(8080, function() {
	console.log("App listening at localhost:8080");
});

// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_app35630541:t7o4608r8ljn0et793k8fcp1uu@ds061391.mongolab.com:61391/heroku_app35630541';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
    if (error) {
        console.log(error);
    }
});

app.post('/sendLocation', function(request, response) {
    
    if (request.body.login && request.body.lat && request.body.lng) {
        var reqlogin = request.body.login;
        var reqlat = parseFloat(request.body.lat);
        var reqlng = parseFloat(request.body.lng);
        var reqcreated_at = Date();
    
        var toInsert = {
            "login": reqlogin,
            "lat": reqlat,
            "lng": reqlng,
            "created_at": reqcreated_at
        };
    
        db.collection('locations', function(err, collection) {   
            collection.update({login: reqlogin}, toInsert, {upsert: true}, 
                                    function(updateErr, inserted) {
                if (updateErr) {
                    response.send({}); 
                }
                else {
                    console.log("new item");
                        collection.find().toArray(function(err, results) {
                                response.send(results);
                        });
                } 
            });
        });
    } else {
        response.send(JSON.stringify(
        {"error":"Whoops, something is wrong with your data!"}));
    }
});

app.get('/location.json', function(request, response) {
	
    var searchlogin = request.query.login;
    console.log(searchlogin);
	db.collection('locations', function(err, collection) {
		collection.find( {login: searchlogin} ).sort({created_at: -1}).toArray(function(err, cursor) {
			if (cursor.length > 0) {
                console.log("found something");
				response.send(cursor[0]);
			} else {
			    response.send({});
            }
		});
	});
});


app.get('/', function(request, response) {
    response.set('Content-Type', 'text/html');
    var indexPage = '';
    db.collection('locations', function(er, collection) {
        collection.find().sort({created_at: -1}).toArray(function(err, cursor) {
            if (!err) {
                indexPage += "<!DOCTYPE HTML><html><head><title>Map Server</title></head><body><h1>Map Server</h1>";
                console.log("ok");
                for (var count = 0; count < cursor.length; count++) {
                    indexPage += "<p>" + cursor[count].login + " checked in at " +
                                cursor[count].lat + ", " + cursor[count].lng +
                                " on " + cursor[count].created_at + "</p>";
                    console.log(cursor[count].login);
                    //cursor[count].login
                }
                indexPage += "</body></html>";
                response.send(indexPage);
                console.log("finished");
            } else {
                response.send('<!DOCTYPE HTML><html><head><title>Map Server</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
                console.log("wrong");
            }
        });
    });

});

app.listen(4200);

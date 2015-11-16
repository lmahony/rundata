var express = require('express');
var strava = require('strava-v3');
var NodeCache = require("node-cache");
var appCache = new NodeCache();
var helpers = require('./helpers/helpers.js')
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));



/* helper methods for views */
app.locals.displayDate = function(dateStr) {
    return dateStr.toUpperCase().split("T")[0];
};
app.locals.displayTime = function(dateStr) {
    return dateStr.toUpperCase().split("T")[1].split("Z")[0];
};
app.locals.displayRunDistance = function(metres) {
    return Math.round((metres/1000) * 100) / 100;
}
app.locals.displayRunTime = function(time) {
    return Math.round(time / 60);
}
app.locals.displayName = function(first, last) {
    return helpers.capitalizeInitial(first) + " " + helpers.capitalizeInitial(last);
}
app.locals.displayWorkoutType = function(workout) {
    switch (workout) {
        case 1:
            return "";
            break;
        case 2:
            return "Long Run";
            break;
        case 3:
            return "Workout";
            break;
        case 4:
            return "Race";
            break;
        default:
            return "";
    }
}

app.get('/', function (req, res) {
    res.send('RunData!');
});

app.get('/athlete', function(req, res){
    strava.athlete.get({}, function(err, payload){
        if (!err) {
            res.render('pages/athlete', {payload: payload});
        } else {
            console.log(err);
            res.send(err);
        }
    });
});

app.get('/activities', function(req,res){
    strava.athlete.listActivities({}, function(err, payload){
        if (!err) {
            res.render('pages/activities', {payload: payload});
        } else {
            console.log(err);
            res.send(err);
        }
    });
});

app.get('/activity/:id', function(req,res){
    strava.activities.get({id:req.params.id}, function(err, payload){
        if (!err) {
            res.render('pages/activity', {payload: payload});
        } else {
            console.log(err);
            res.send(err);
        }
    });
});

app.get('/raw/activity/:id', function(req,res){
    strava.activities.get({id:req.params.id}, function(err, payload){
        if (!err) {
            res.send(payload);
        } else {
            res.send(err);
        }
    });
});

app.get('/raw/athlete', function(req, res){
    strava.athlete.get({}, function(err, payload){
        if (!err) {
            res.send(payload);
        } else {
            res.send(err);
        }
    }) ;
});

app.get('/raw/list-activities', function(req, res) {
    strava.athlete.listActivities({}, function(err, payload){
       if (!err) {
           res.send(payload);
       } else {
           res.send(err);
       }
    });
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
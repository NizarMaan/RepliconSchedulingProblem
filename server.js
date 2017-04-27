/*
Created by Nizar Maan
*/

var express = require('express'); //import express
var fs = require('fs'); //import fs
var ejs = require('ejs'); //import our embedded html server code renderer, ejs
var request = require('request');

var app = express(); //reference to our app routes etc.

//set our host
var server= app.listen(8000, listening);

//hosting static files, the ability to host html files, images, css, js etc.
app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs');

//dynamically initialize databases (Models)
fs.readdirSync('./Models').forEach(function(file){
  if(file.substr(-3) == '.js') {
      var model = require('./Models/' + file);
      model.init_data();
  }
});

//dynamically include routes (Controllers)
fs.readdirSync('./Controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      var route = require('./Controllers/' + file);
      route.controller(app);
  }
});

function listening(){
    console.log("listening to port: " + server.address().port + "...");
}

module.exports = app;

//-------------------------------sending the solution---------------------------------//
/*var solution = require('./Models/shiftSchedule').getSchedule();

var name = 'NizarMaan';
var email = 'maannizar@hotmail.com';
var features = '&features[]=1&features=2';

request({
    url: 'http://interviewtest.replicon.com/submit?name=' + name + '&email=' + email + features + '&solution=true',
    method: 'POST',
    json: true,
    headers:{
        "content-type": "application/json"
    },
    body: solution
}, function(error, response, body){
    console.log(JSON.parse(JSON.stringify(body)));
});*/
//------------------------------------------------------------------------------------//

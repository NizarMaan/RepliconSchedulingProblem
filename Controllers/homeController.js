var fs = require('fs'); //import fs
var request = require('request');

module.exports.controller = function(app){
    /*
     *Home page route
     */
    app.get('/', function(request, response, next){
        response.render('index.ejs');
    });
}

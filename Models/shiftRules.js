var request = require('request');
var fs = require('fs');

var apiURL = 'http://interviewtest.replicon.com';
var rulesURL = '/shift-rules';
var rules;

module.exports = {
    init_data: function(){
        requestRules(apiURL+rulesURL, function(data){
            if(emptyDb()){
                //write to file every time
                data = JSON.stringify(data, null, 2);
                fs.writeFile('../RepliconProblem/Models/shiftRulesData.json', data, doneWriting);

                function doneWriting(err){
                    if(rules === undefined){
                        var data = fs.readFileSync('../RepliconProblem/Models/shiftRulesData.json');
                        try{
                            rules = JSON.parse(data);
                        }
                        catch(err){
                            console.log(err.message);
                        }
                    }
                }
            }
        });
    },

    getRules: function(){
        if(rules === undefined){
            var data = fs.readFileSync('../RepliconProblem/Models/shiftRulesData.json');
            try{
                rules = JSON.parse(data);
            }
            catch(err){
                console.log(err.message);
            }
        }
        return rules;
    }
}

function requestRules(url, callback){
    request({
            url: url,
            json: true
    }, function(error, response, body){
        if(!error & response.statusCode === 200){
            callback(body);
        }
        else{
            console.log("error");
        }
    });
}

//if our JSON file with data is empty or invalid, then write to it/fill it
function emptyDb(){
    var data = fs.readFileSync('../RepliconProblem/Models/shiftRulesData.json');
    //if it cannot parse, it is empty or invalid json
    try{
        JSON.parse(data);
    }
    catch(err){
        //our json data file is empty, so write to it
        return true;
    }

    return false;
}
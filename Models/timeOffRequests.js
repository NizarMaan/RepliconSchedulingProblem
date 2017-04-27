var request = require('request');
var fs = require('fs');

var apiURL = 'http://interviewtest.replicon.com';
var requestsURL = '/time-off/requests';
var timeOffRequests;

module.exports = {
    init_data: function(){
        requestTimeOff(apiURL + requestsURL, function(data){
            if(emptyDb()){
                //write to file every time, maybe requests are changed
                data = JSON.stringify(data, null, 2);
                fs.writeFile('../RepliconProblem/Models/timeOffRequestsData.json', data, doneWriting);

                function doneWriting(err){
                    if(timeOffRequests === undefined){
                        var data = fs.readFileSync('../RepliconProblem/Models/timeOffRequestsData.json');
                        try{
                            timeOffRequests = JSON.parse(data);
                        }
                        catch(err){
                            console.log(err.message);
                        }
                    }
                }
            }
        });
    },

    getTimeOffRequests: function(){
        if(timeOffRequests === undefined){
            var data = fs.readFileSync('../RepliconProblem/Models/timeOffRequestsData.json');
            try{
                timeOffRequests = JSON.parse(data);
            }
            catch(err){
                console.log(err.message);
            }
        }
        return timeOffRequests;
    }
}

function requestTimeOff(url, callback){
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
    var data = fs.readFileSync('../RepliconProblem/Models/timeOffRequestsData.json');
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
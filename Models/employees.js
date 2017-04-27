var request = require('request');
var fs = require('fs');

var apiURL = 'http://interviewtest.replicon.com';
var employeesURL = '/employees';
var employees;

module.exports = {
    init_data: function(){
        requestEmployees(apiURL+employeesURL, function(data){
            if(emptyDb()){
                //write to file every time, maybe new employees are added, or employees removed
                data = JSON.stringify(data, null, 2);
                fs.writeFile('../RepliconProblem/Models/employeesData.json', data, doneWriting);

                function doneWriting(err){
                    if(employees === undefined){
                        var data = fs.readFileSync('../RepliconProblem/Models/employeesData.json');
                        try{
                            employees = JSON.parse(data);
                        }
                        catch(err){
                            console.log(err.message);
                        }
                    }
                }
            }
        });
    },

    getEmployees: function(){
        if(employees === undefined){
            var data = fs.readFileSync('../RepliconProblem/Models/employeesData.json');
            try{
                employees = JSON.parse(data);
            }
            catch(err){
                console.log(err.message);
            }
        }
        return employees;
    }
}

function requestEmployees(url, callback){
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
    var data = fs.readFileSync('../RepliconProblem/Models/employeesData.json');
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

//Would implement if it were a changing DB, but as far as this problem goes, the data is always the same
//if the new info served from API is different from our current data, then rewrite with newly provided data
/*function dbChanged(){
     return false;
}*/
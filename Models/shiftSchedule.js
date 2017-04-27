/*
    This is where the weekly schedule creation logic takes place
*/
var fs = require('fs');

var employeeData  = require('./../Models/employees').getEmployees();

var timeOffData = require('./../Models/timeOffRequests').getTimeOffRequests();

var shiftRulesData = require('./../Models/shiftRules').getRules();

var generatedSchedule = [];

var weeklySchedule, employeeWeeklySchedule, EMPLOYEES_PER_SHIFT;

module.exports = {
    init_data: function(){
        if(emptyDb()){       
            generateSchedule();
            generatedSchedule = JSON.stringify(generatedSchedule, null, 2);  
            fs.writeFile('../RepliconProblem/Models/shiftScheduleData.json', generatedSchedule);
        }
    },

    getSchedule: function(){
        if(generatedSchedule.length === 0){
            var data = fs.readFileSync('../RepliconProblem/Models/shiftScheduleData.json');
            try{
                generatedSchedule = JSON.parse(data);
            }
            catch(err){
                console.log("ERROR " + err.message);
            }
        }
        return generatedSchedule;
    }
}

//implementing Features 1 & 2 - EMPLOYEES_PER_SHIFT rule and granting days off as per given requests
function generateSchedule(){
    /*var employeesPerShift used as an array where the value in each index represents the number of employees scheduled 
    for a shift where index 0 is monday and index 6 is sunday
    serves to keep track of number of employees already assigned to a shift so as to uphold an EMPLOYEES_PER_SHIFT rule
    */
    var employeesPerShift; 

    //checking EMPLOYEES_PER_SHIFT value
    for (var i = 0; i < shiftRulesData.length; i++){
        if(shiftRulesData[i].rule_id === 7){
            EMPLOYEES_PER_SHIFT =  shiftRulesData[i].value;
        }
    }

    //loop for each week of the month of June (weeks 23-26)
    for(var w = 0; w < 4; w++){

        //initialize a new week object for every new week
        weeklySchedule = {
            "week": 23+w,
            "schedules": []
        }

        //set or reset our employees per shift tracking array
        employeesPerShift = [0, 0, 0, 0, 0, 0, 0];

        //check for each employee if they can work for any given day of the week
        for(var e = 0; e < employeeData.length; e++){

            //initialize a new employeeWeeklySchedule object for every employee
            employeeWeeklySchedule = {
                "employee_id": null,
                "schedule": []
            }

            //check if current employee has time-off requests for the week
            var r = requestsForWeek(23+w, e);

            //if they do have requests...
            if(r.length > 0){
                //loop for each day of the week and keep track of the days an employee can work
                for(var d = 1; d < 8; d++){
                    //if there not already enough employees assigned to this shift per the EMPLOYEES_PER_SHIFT rule...
                    if(employeesPerShift[d-1] < EMPLOYEES_PER_SHIFT){
                        //if there is no time-off request for today, schedule the employee for the day
                        if(!timeOffRequestContains(r, d)){
                            employeeWeeklySchedule.employee_id = employeeData[e].id;
                            employeeWeeklySchedule.schedule.push(d); 
                            employeesPerShift[d-1] =  employeesPerShift[d-1] + 1;    
                        } 
                    }
                } 

                if(employeeWeeklySchedule.employee_id != null){
                    weeklySchedule.schedules.push(employeeWeeklySchedule);
                }
            }
            //else, schedule them for every day of that week
            else{
                for(var d = 1; d < 8; d++){
                    //if there not already enough employees assigned to this shift per the EMPLOYEES_PER_SHIFT rule...
                    if(employeesPerShift[d-1] < EMPLOYEES_PER_SHIFT){
                        employeeWeeklySchedule.employee_id = employeeData[e].id;
                        employeeWeeklySchedule.schedule.push(d);
                        employeesPerShift[d-1] =  employeesPerShift[d-1] + 1;
                    }
                }
                
                if(employeeWeeklySchedule.employee_id != null){
                    weeklySchedule.schedules.push(employeeWeeklySchedule);
                }
            }
        }
        generatedSchedule.push(weeklySchedule);
    }
};

//a helper function to determine whether a list of time off requests contains a given day
function timeOffRequestContains(indicesList, day){
    var contains = false;

    //if there is more than one request object, loop through every list
    if(indicesList.length > 1){
        for(var i = 0; i < indicesList.length; i++){
            for(var j = 0; j < timeOffData[indicesList[i]].days.length; j++){
                if(timeOffData[indicesList[i]].days[j] === day){
                    contains = true;
                }
            }
        }
    }
    //else, just loop through the single request object
    else{
        var index = indicesList[0];
        for(var i = 0; i < timeOffData[index].days.length; i++){
            if(timeOffData[index].days[i] === day){
                contains = true;
            }
        }
    }

    return contains;
}

/*helper function to determine whether a given employee has time-off requests for a given week
returns an array of index locations of ALL time-off requests, if array is empty no requests have been made
*/
function requestsForWeek(currentWeek, employee){
    var requests = [];

    for(var i = 0; i < timeOffData.length; i++){
        //if there exists a request of the same week, and same employee then store its index
        if(timeOffData[i].week === currentWeek && timeOffData[i].employee_id === employeeData[employee].id){
            requests.push(i);
        }
    }
    return requests;
}

//if our JSON file with data is empty or invalid, then write to it/fill it
function emptyDb(){
    var data = fs.readFileSync('../RepliconProblem/Models/shiftScheduleData.json');
    //if it cannot parse, it is empty or invalid json
    try{
        JSON.parse(data);
    }
    catch(err){
        //our json data file is empty or invalid JSON, so write to it
        return true;
    }

    return false;
};
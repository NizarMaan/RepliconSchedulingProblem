var fs = require('fs'); //import fs
var request = require('request');

var employeeData = require('./../Models/employees');
var scheduleData = require('./../Models/shiftSchedule')

module.exports.controller = function(app){
    /*
     *Employee list page route
     */
    app.get('/employees', function(request, response, next){
        var schedule = genSimpleShiftList();
        var employeeList = employeeData.getEmployees();
        
        response.render('employeeList.ejs', {employees: employeeList, schedule: schedule});
    });

    //query an id number to get an employee's details (name, id)
    app.get('/employees/:id', function(request, response, next){
        var employeeList = employeeData.getEmployees();
        var employee;
        var found = false;

        for(var i = 0; i < employeeList.length; i++){
            if(employeeList[i].id === parseInt(request.params.id)){
                found = true;
                employee = employeeList[i];
            }
        }

        if(found){
            response.send(employeeList[parseInt(request.params.id)-1]);
        }
        else{
            response.status(404).send(":( sorry! employee with id: " + request.params.id +  " not found");
        }
    });

    /*simplify the JSON schedule into a 2D list where each index contains
    the list of days (possibly 1-31) an employee works in a month
    each index in the simplified list, shiftList, represents the ID number of an employee (minus 1)
    */
    function genSimpleShiftList(){
        var employeeList = employeeData.getEmployees();
        var generatedSchedule = scheduleData.getSchedule();
        var shiftList = [];
        var employeeShifts = [];

        //initialize our shiftList array values
        for(var i = 0; i < employeeList.length; i++){
            shiftList.push(null);
        }

        //for each employee "i"
        for(var i = 0; i < employeeList.length; i++){
            employeeShifts = []; //reset shifts array for new employee
            //for each week "j" in the schedule
            for(var j = 0; j < generatedSchedule.length; j++){
                //for each employee's schedule, "k"
                for(var k = 0; k < generatedSchedule[j].schedules.length; k++){
                    //if the current schedule matches the current employee
                    if(employeeList[i].id === generatedSchedule[j].schedules[k].employee_id){
                        //for each shift "x" in the employees schedule
                        for(var x = 0; x < generatedSchedule[j].schedules[k].schedule.length; x++){
                            var weekDayToMonthDay = generatedSchedule[j].schedules[k].schedule[x]+(7*j);
                            employeeShifts.push(weekDayToMonthDay);
                        }
                        //add newly formed employee shift list to master shift list @ index that matches employee's id
                        shiftList[employeeList[i].id-1] = employeeShifts;
                    }
                }
            }
        }

        return shiftList;
    }
}
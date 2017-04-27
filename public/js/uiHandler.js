$(document).ready(function(){
    var currentSchedule, currentEmployeeTab;
    var originalTabColor = 'whitesmoke';
    var selectedTabColor = 'rgba(60, 179, 113, 0.35)';

    $(".welcome-message").fadeIn(1500, 'linear', function(){
        $(".welcome-message-sub").fadeIn(1000, 'linear');
    });

    $(document).click(function(evt){
        var target = $(evt.target);
        if(target.parents('.employee-container').length > 0){
            var schedulePicked = $("#schedule"+target.closest('.employee-container').attr('id'));

            if(currentSchedule === undefined){
                showScheduleContainer();
                showSchedule(schedulePicked);
                setTabColor(target);
            }
            else if(!$(currentSchedule).is(schedulePicked)){
                currentEmployeeTab.css('background-color', originalTabColor);
                setTabColor(target);
  
                currentSchedule.hide();
                showSchedule(schedulePicked);
            }
        }
    });

    function showScheduleContainer(){
        $(".schedule-container").show();
    };

    function showSchedule(schedule){
        showScheduleContainer();
        currentSchedule = schedule;
        currentSchedule.show();
    };

    function setTabColor(target){
        currentEmployeeTab = target.closest('.employee-container');
        currentEmployeeTab.css('background-color', selectedTabColor);
    };
});
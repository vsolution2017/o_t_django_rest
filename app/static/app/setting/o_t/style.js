$(function(){

    $('.date-mes').datetimepicker();


    $("#_cancel").click(function(){
        alert("Cancelar");
    });
    $("#_save").click(function(){
        _save();
    });
});

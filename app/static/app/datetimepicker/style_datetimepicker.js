$('.month_date').datetimepicker({
    language:  'es',
    todayBtn:  1,
    startView: 3,
    minView: 3,
    autoclose: 1,
    format: 'yyyy-MM'
});
$('.month_date').datetimepicker('update', new Date());
$('.year_date').datetimepicker({
    language:  'es',
    todayBtn:  1,
    todayHighlight: true,
    startView: 4,
    minView: 4,
    autoclose: 1,
    format: 'yyyy'
});
 /*$('.day_date').datetimepicker({
    language:  'es',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: true,
    startView: 2,
    minView: 2,
    forceParse: 0,
    format: 'dd MM yyyy',
     linkFormat: 'yyyy-mm-dd'
});*/

 $('.day_date')
    .datetimepicker({
        language:  'es',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: true,
        startView: 2,
        minView: 2,
        forceParse: 0,
        format: 'dd MM yyyy',
         linkFormat: 'yyyy-mm-dd'
    })
    .on('changeDate', function(ev){
        field = $(ev.target).attr("data-link-field");
        //console.log(field);
        $("#"+field).change();
});

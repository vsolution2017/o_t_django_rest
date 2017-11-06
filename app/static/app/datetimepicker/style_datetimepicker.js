$('.month_date').datetimepicker({
        language:  'es',
        todayBtn:  1,
        startView: 3,
        minView: 3,
        autoclose: 1,
        format: 'yyyy-MM'
    })
    .on('changeDate', function(ev){
        field = $(ev.target).attr("data-link-field");
        $("#"+field).change();
});

$('.year_date').datetimepicker({
    language:  'es',
    todayBtn:  1,
    todayHighlight: true,
    startView: 4,
    minView: 4,
    autoclose: 1,
    format: 'yyyy'
}).on('changeDate', function(ev){
        field = $(ev.target).attr("data-link-field");
        $("#"+field).change();
});

$('.month_date, .year_date').datetimepicker('update', new Date());

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
        $("#"+field).change();
});

function parseFecha_moment(fecha){
    return moment(fecha);
}
function parseFecha_Date(fecha){
    return moment(fecha).toDate();
}




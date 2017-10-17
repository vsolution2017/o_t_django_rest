function getData(){
    data = {
        seguridad : {
            t_si: $("#t_si").val(),
            c_hombre: $("#c_hombre").val()
        },
        operacion : {
            porcentaje_op : $("#porcentaje_op").val()
        },
        transporte : {
            t_km : $("#t_km").val(),
            v_km: $("#v_km").val()
        }
    };
    return {
        fecha_mes: $("#f_precio").val(),
        valores: JSON.stringify(data)
    };
}
function _save(){
    $.ajax({
        url : "/app/s_PrecioRubro/",
        type: "POST",
        dataType: "json",
        data: getData(),
        success: function(response){
            console.log(response);
        }
    });
}

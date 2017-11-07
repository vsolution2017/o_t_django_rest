function load_precio_rubro(pag){
    cant = parseInt($("#cboCant").selectpicker("val"));
    $.ajax({
        url: "/app/list/precio_rubro/",
        type: "POST",
        data:{
            inicio: (pag * cant) - cant,
            fin: ((pag + 1) * cant) - cant,
            año: parseFecha_moment($("#fecha_mes").val()).year()
        },
        success: function (data) {
            total = Math.ceil(data.count / cant);
            $("#tb_precio_rubro").bootstrapTable("load",data.datos);

            $('#pagination-demo').twbsPagination('destroy');
            $("#pagination-demo").twbsPagination(
                $.extend({},_defaultOption,{
                    startPage: pag,
                    totalPages: total,
                    onPageClick: function (event, page) {
                        load_precio_rubro(page);
                    }
                })
            );
        }
    });
}

function btn_accion(){
    buttons =
        "<button name='edit' class='btn btn-sm btn-primary'><i class='fa fa-edit'></i> Editar</button> " +
        "<button name='del' class='btn btn-sm btn-danger'><i class='fa fa-trash'></i> Eliminar</button> ";
    return buttons;
}

function getData(id){
    valores = {
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
        },
        rrhh: {
            promedio : $("#rrhh_avg").val()
        }
    };

    data = {
        fecha_mes: $("#f_precio").val(),
        valores: JSON.stringify(valores)
    };
    if(id != 0){
        $.extend(data,{
                id:id
            });
    }
    return data;
}

function _delete(id){
    $.ajax({
        url : "/app/s_PrecioRubro/"+ id+"/id",
        type: "DELETE",
        success: function(response){
            load_precio_rubro(1);
        }
    });

}

function _save(id,method){
    url = id == 0 ? "/app/s_PrecioRubro/" : "/app/s_PrecioRubro/"+ id+"/id";
    $.ajax({
        url : url,
        type: method,
        dataType: "json",
        data: getData(id),
        success: function(response){
            $(".modal").modal("toggle");
            load_precio_rubro(1);
        }
    });
}

function load_precio_rubro(){
    $.get("/app/s_PrecioRubro/",function(response){
        $.each(response,function(i,row){
            $.extend(row,{
                accion : "<button name='edit' d-id='"+ row.id +"' class='btn btn-sm btn-primary'><i class='fa fa-edit'></i> Editar</button> " +
                        "<button name='delete' d-id='"+ row.id +"' class='btn btn-sm btn-danger'><i class='fa fa-trash'></i> Eliminar</button>"
            });
        });
        $("#tb_precio_rubro").bootstrapTable("load",response);
    });
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
    //console.log(data);
    return data;
}

function _delete(id){
    $.ajax({
        url : "/app/s_PrecioRubro/"+ id+"/id",
        type: "DELETE",
        success: function(response){
            load_precio_rubro();
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
            console.log(response);
            $(".modal").modal("toggle");
            load_precio_rubro();
        }
    });
}

function load_OrdenTrabajo(pag){
    fecha = parseFecha_Date($("#fecha_mes").val());
    fechaI = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    fechaF = new Date(fecha.getFullYear(), fecha.getMonth()+1, 0);
    cant = parseInt($("#cboCant").selectpicker("val"));
    $.ajax({
        url : "/app/list/ot/",
        type: "POST",
        data: {
            finicio: moment(fechaI).format("YYYYMMDD"),
            ffin: moment(fechaF).format("YYYYMMDD"),
            inicio: (pag * cant) - cant,
            fin: ((pag + 1) * cant) - cant
        },
        success: function (data) {
            total = Math.ceil(data.count / cant);

            $("table").bootstrapTable("load",data.datos);
            $('#pagination-demo').twbsPagination('destroy');
            $("#pagination-demo").twbsPagination(
                $.extend({},_defaultOption,{
                    startPage: pag,
                    totalPages: total,
                    onPageClick: function (event, page) {
                        load_OrdenTrabajo(page);
                    }
                })
            );

        }
    });
}
/*function parseFecha(fecha){
    return moment(fecha);
}*/

function generarExcel_fecha(){
    fecha = moment($("#fecha_mes").val());
    fecha.set("date",1);
    $("#gen_consolidado").attr("href",'/app/g_cconsolidado/' + fecha.format("YYYYMMDD"));
}

function btn_accion(){
    buttons =
        '<button name="edit" class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></button> '+
        '<button name="del" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button> ';
    return buttons;
}
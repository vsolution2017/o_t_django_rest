$(function(){
    $("#tb_OrdenesTrabajo").bootstrapTable();
    load_OrdenTrabajo();
    generarExcel_fecha();

    $("#gen_consolidado").click(function (e) {
        generarExcel_fecha();
        //alert($(this).attr("href"));
        //e.preventDefault();

    });
});

function generarExcel_fecha(){
    fecha = moment($("#fecha_mes").val());
    fecha.set("date",1);
    $("#gen_consolidado").attr("href",'/app/g_cconsolidado/' + fecha.format("YYYYMMDD"));
}

window.func_accion ={
    'click button[name="edit"]': function (e, value, row, index) {
        window.location.href = "/app/o_t/"+row.id;
    },
    'click button[name="del"]': function (e, value, row, index) {
        alert("Eliminar Orden Trabajo");
        /*$.ajax({
            url : "/app/s_OrdenTrabajo/"+ row.id,
            type: "DELETE",
            success: function(response){
                load_OrdenTrabajo();
            }
        });*/
    }
};
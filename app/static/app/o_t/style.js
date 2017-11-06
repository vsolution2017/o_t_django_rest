_defaultOption ={
    visiblePages: 3,
    initiateStartPageClick: false,
    first: "&laquo;",
    prev: "&lsaquo;",
    next: "&rsaquo;",
    last: "&raquo;"
};
$(function(){

    $("#gen_consolidado").click(function (e) {
        generarExcel_fecha();
    });

    $("#fecha_mes").change(function () {
        load_OrdenTrabajo(1);
    });

    $("#tb_OrdenesTrabajo").bootstrapTable();

    load_OrdenTrabajo(1);
});


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
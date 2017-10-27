$(function(){
    $("table").bootstrapTable();
    load_OrdenTrabajo();
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
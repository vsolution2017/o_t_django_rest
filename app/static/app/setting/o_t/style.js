table = ("#tb_precio_rubro");
_defaultOption ={
    visiblePages: 3,
    initiateStartPageClick: false,
    first: "&laquo;",
    prev: "&lsaquo;",
    next: "&rsaquo;",
    last: "&raquo;"
};
$(function(){
    $(table).bootstrapTable();

    $("#_save").data("id",0);

    load_precio_rubro(1);

    $("#fecha_mes").change(function () {
        load_precio_rubro(1);
    });

    $(".modal").on("hidden.bs.modal",function(e){
        $(".modal input").each(function(i,input){
            $(input).val("");
        });
        $("#_save").data("id",0);
    });

    $("#_cancel").click(function(){
        alert("Cancelar");
    });

    $("#_save").click(function(){
        id = $(this).data("id");
        method = (id == 0)? "POST":"PUT";
        _save(id,method);
    });

});

window.func_accion ={
    'click button[name="edit"]': function (e, value, row, index) {
        //window.location.href = "/app/o_t/"+row.id;
        //row = $(table).bootstrapTable("getRowByUniqueId",$(this).attr("d-id"));

        $(".modal").find(".modal-title").html("Editar Registro");
        $(".modal").find(".month_date").datetimepicker("update",moment(row.fecha_mes).toDate());


        valores = JSON.parse(row.valores);

        /* Transporte */
        $(".modal").find("input[id='t_km']").val(valores.transporte.t_km);
        $(".modal").find("input[id='v_km']").val(valores.transporte.v_km);
        /* Transporte */
        /* Operaciones */
        $(".modal").find("input[id='porcentaje_op']").val(valores.operacion.porcentaje_op);
        /* Operaciones */
        /* Seguridad */
        $(".modal").find("input[id='t_si']").val(valores.seguridad.t_si);
        $(".modal").find("input[id='c_hombre']").val(valores.seguridad.c_hombre);
        /* Seguridad */

        /* RRHH */
        $(".modal input[id='rrhh_avg']").val(valores.rrhh.promedio);
        /* RRHH */

        $("#_save").data("id",row.id);

        $(".modal").modal("toggle");
    },
    'click button[name="del"]': function (e, value, row, index) {
        _delete(row.id);
    }
};

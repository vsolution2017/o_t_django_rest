table = ("#tb_precio_rubro");
$(function(){
    $(table).bootstrapTable();
    //$(":input").inputmask();
    $("#_save").data("id",0);

    load_precio_rubro();

    $(".modal").on("hidden.bs.modal",function(e){
        $(".modal input").each(function(i,input){
            $(input).val("");
        });
        $("#_save").data("id",0);
    });

    $(table).on("click","button[name='delete']",function () {
        id = $(this).attr("d-id");
        _delete(id);
    });

    $(table).on("click","button[name='edit']",function () {
        row = $(table).bootstrapTable("getRowByUniqueId",$(this).attr("d-id"));

        $(".modal").find(".modal-title").html("Editar Registro");
        $(".modal").find("#f_precio").val(row.fecha_mes);


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

        $("#_save").data("id",row.id);
        //console.log(row.id);

        $(".modal").modal("toggle");
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

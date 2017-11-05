$(function () {

    $("#tab_maquinaria table").bootstrapTable();
    $("#tab_rubros table").bootstrapTable();
    $('#exTab2 select').selectpicker();


    $(".day_date:not(.exclude)").datetimepicker("update",new Date());

    load_Mantenimiento("#cboTipo_mantenimiento");
    load_Parroquia("#cboParroquia");
    load_Cargos(1,"#cbo_jefe");
    load_Cargos(2,"#cbo_coord");
    load_TipoActividad("#cboTipoActividad");
    load_contratista();

    load_pag();

    $("#_cod").val(gen_Cod());

    $("#_save").click(function(){
        $.ajax({
            url : "/app/s_OrdenTrabajo/",
            type: "POST",
            data: get_save(),
            success: function (response) {
                console.log(response);
                window.location.href = "/app/list_ot/";
            }
        });
    });

    $('button[name="remove_tb"]').click(function(){
        row = $(this).closest(".row");
        table = $(row).find("table");
        ids = $.map($(table).bootstrapTable("getSelections"),function (row) {
            return row.id;
        }) ;
        $(table).bootstrapTable("remove",{
            field: 'id',
            values: ids
        });
        total_tabMaquinaria();

    });

    $('.dropdown-menu[role="combobox"]').removeClass("open");

    $("#cboContratista").change(function(){
        load_maquinarias("#cbo_maq", $(this).val());
    });

    $("#cboTipo_mantenimiento").change(function(e){
       $("#_cod").val(gen_Cod());
    });

    $("#tab_actividades").on("click","label.buying-selling",function(){
        datos = $(this).data("json");
        div = $(this).closest(".row").find("input.costo").val(parseFloat(datos.precio)).change();
    });

    /*Actividades*/

    $("#tab_actividades").on("change", ".input-area", function () {
        SumarAreas(".input-area", ".contenedor-area", ".total-area", this);
    });

    $("#tab_actividades").on("change", ".total-area", function () {
        _sumTotalAreas($(this).closest(".content"));
    });

    $("#tab_actividades").on("change", "input[name='total_actividad']", function () {
       total_tabActividad();
    });

    $("#tab_actividades").on("change", "input[name='costo_actividad']", function () {
        sum = 0;
        $(this).closest(".row").find("input[name='costo_actividad']").each(function(i,input){
            if(sum == 0){
                sum = parseFloat($(input).val());
            }
            else {
                sum *= parseFloat($(input).val());
            }
        });
        $(this).closest(".row").find("input[name='total_actividad']").val(sum.toFixed(2)).change();
    });

    $("input[name='costo_tab']").change(function (e) {
        total = 0;
        $.each($("input[name='costo_tab']"),function (i,input) {
            total += parseFloat($(input).val());
        });
        $("input[name='costo_general']").val(total.toFixed(2));
    });

    $("#exTab2").on("click","button[name='btn_area']",function () {
        op_area = $(this).closest(".row").find(".op_add_area").clone();
        $(op_area).removeClass("hidden");
        $(op_area).removeClass("op_add_area");
        $(op_area).addClass("add_area");
        $(this).closest(".row").find(".content").append(op_area);
    });

    $("#exTab2").on("click","button[name='btn_del_actividad']",function () {
        actividades = $("#cont-actividades").data("actividades");
        id = $(this).data("id");
        actividades.splice($.inArray(id, actividades),1);
        $("#cont-actividades").data("actividades",actividades)
        $(this).closest(".row").remove();
        total_tabActividad();
    });

    $("#btn_add_activity").click(function(){
        id_actividad = $("#cboTipoActividad").selectpicker("val");
        datos = cbo_option("#cboTipoActividad");

        bandera = true;
        actividades = [];
        if(!$.isEmptyObject($("#cont-actividades").data("actividades"))){
            actividades = $("#cont-actividades").data("actividades");
            if($.inArray(datos.id, actividades) == -1){
                actividades.push(datos.id);
                $("#cont-actividades").data("actividades",actividades);
            }
            else {
                alert("Actividad agregada");
                bandera = false;
            }
        }else{
            actividades.push(datos.id);
            $("#cont-actividades").data("actividades",actividades);
        }
        if(bandera){
            sub_actividades = getSubActividades(id_actividad);
            actividad_sample = $("#cont-actividades .actividad_sample").clone();
            $(actividad_sample).data("json",datos);
            $(actividad_sample).removeClass("actividad_sample");
            $(actividad_sample).removeClass("hidden");
            $(actividad_sample).find("span[name='titulo_actividad']").html(datos.descripcion);
            $(actividad_sample).find("button[name='btn_del_actividad']").data("id",datos.id);
            $(actividad_sample).data("sub_actividades",sub_actividades);
            $(actividad_sample).attr("name","_actividades");

            if(sub_actividades.length === 1){
                if(sub_actividades[0].descripcion === "_"){
                    $(actividad_sample).find("input.costo").val(parseFloat(sub_actividades[0].precio)).change();
                }
            }else{
                $.each(sub_actividades,function(i,sub_actividad){
                    op_subactividad = $(actividad_sample).find(".op_subactividad").clone();
                    $(op_subactividad).data("json",sub_actividad);
                    $(op_subactividad).attr("data-id",sub_actividad.id);
                    $(op_subactividad).removeClass("hidden");
                    $(op_subactividad).removeClass("op_subactividad");
                    $(op_subactividad).find(".buying-selling-word").html(sub_actividad.descripcion);
                    $(op_subactividad).find("input[type]").attr("type",(datos.op_seleccion === 1)?"radio":"checkbox");
                    $(actividad_sample).find(".buying-selling-group").append(op_subactividad);
                });
            }

            /*$(actividad_sample).find("input.decimal").inputmask("decimal",{
                rightAlign :false,
                digits: 2,
                greedy: false
            });*/
            $("#cont-actividades").append(actividad_sample);
        }
    });

    $("#tab_actividades").on("click", ".delete", function () {
        _content = $(this).closest(".content");
        $(this).closest(".row").remove();
        _sumTotalAreas(_content);
    });

    $("#tab_actividades").on("click", ".edit", function () {
        $(this).removeClass("btn-info");
        $(this).addClass("btn-success");
        $(this).find("i").removeClass("fa-pencil");
        $(this).find("i").addClass("fa-floppy-o");
        //$(this).closest(".input-group").find("input").val("");
        $(this).closest(".input-group").find("input").removeAttr('readonly');
        $(this).removeClass("edit");
        $(this).addClass("save");
    });

    $("#tab_actividades").on("click", ".save", function () {
        $(this).addClass("btn-info");
        $(this).removeClass("btn-success");
        $(this).find("i").addClass("fa-pencil");
        $(this).find("i").removeClass("fa-floppy-o");
        $(this).closest(".input-group").find("input").attr('readonly', 'readonly');
        $(this).addClass("edit");
        $(this).removeClass("save");
    });


});


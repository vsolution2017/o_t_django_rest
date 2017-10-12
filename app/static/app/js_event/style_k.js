$(function () {
    load_contratista();
    load_Mantenimiento("#cboTipo_mantenimiento");
    load_Parroquia("#cboParroquia");
    load_TipoActividad("#cboTipoActividad");

    $('#exTab2 select').selectpicker();
    $('#exTab2 select').selectpicker("val",0);
    $('.dropdown-menu[role="combobox"]').removeClass("open");

    $("#cboContratista").change(function(){
        load_maquinarias("#cbo_maq", $(this).val());
    });


    $("#tab_actividades").on("click","label.buying-selling",function(){
        datos = $(this).data("json");
        div = $(this).closest(".row").find("input.costo").val(datos.precio.costo);
    });



    /*Actividades*/

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
            $(actividad_sample).removeClass("actividad_sample");
            $(actividad_sample).removeClass("hidden");
            $(actividad_sample).find("span[name='titulo_actividad']").html(datos.descripcion);
            $(actividad_sample).find("button[name='btn_del_actividad']").data("id",datos.id);


            $.each(sub_actividades,function(i,sub_actividad){
                //$(actividad_sample).find("input.costo").val(sub_actividad.precio.costo);
                op_subactividad = $(actividad_sample).find(".op_subactividad").clone();
                $(op_subactividad).data("json",sub_actividad);
                $(op_subactividad).removeClass("hidden");
                $(op_subactividad).removeClass("op_subactividad");
                $(op_subactividad).find(".buying-selling-word").html(sub_actividad.descripcion);
                $(op_subactividad).find("input[type]").attr("type",(datos.op_seleccion === 1)?"radio":"checkbox");
                $(actividad_sample).find(".buying-selling-group").append(op_subactividad);
            });
            $("#cont-actividades").append(actividad_sample);
        }
    });



    $("#tab_actividades").on("click", ".delete", function () {
        $(this).closest(".row").remove();
    });

    $("#tab_actividades").on("click", ".edit", function () {
        $(this).removeClass("btn-info");
        $(this).addClass("btn-success");
        $(this).find("i").removeClass("fa-pencil");
        $(this).find("i").addClass("fa-floppy-o");
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
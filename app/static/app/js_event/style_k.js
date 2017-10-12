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
    $("#btn_add_activity").click(function(){



        id_actividad = $("#cboTipoActividad").selectpicker("val");
        console.log(cbo_option("#cboTipoActividad"));

        sub_actividades = getSubActividades(id_actividad);
        actividad_sample = $("#cont-actividades .actividad_sample").clone();
        $(actividad_sample).removeClass("actividad_sample");
        $(actividad_sample).removeClass("hidden");

        $.each(sub_actividades,function(i,sub_actividad){
            op_subactividad = $(actividad_sample).find(".op_subactividad").clone();
            $(op_subactividad).removeClass("hidden");
            $(op_subactividad).removeClass("op_subactividad");
            $(op_subactividad).find(".buying-selling-word").html(sub_actividad.descripcion);
            $(actividad_sample).find(".buying-selling-group").append(op_subactividad);
        });

        $("#cont-actividades").append(actividad_sample);
    });


    /*Actividades*/
    $("#exTab2").on("click","button[name='btn_area']",function () {
        op_area = $(this).closest(".row").find(".op_add_area").clone();
        $(op_area).removeClass("hidden");
        $(op_area).removeClass("op_add_area");
        $(op_area).addClass("add_area");
        $(this).closest(".row").find(".content").append(op_area);
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
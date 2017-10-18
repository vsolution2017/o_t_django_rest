$(function () {
    load_contratista();
    load_Mantenimiento("#cboTipo_mantenimiento");
    load_Parroquia("#cboParroquia");
    load_TipoActividad("#cboTipoActividad");
    load_Cargos(1,"#cbo_jefe");
    load_Cargos(2,"#cbo_coord");


    $("#_save").click(function(){
        console.log(get_TabActividades());
        //$("#cont-actividades").data("actividades");
    });

    $('#exTab2 select').selectpicker();
    $('#exTab2 select').selectpicker("val",0);

    $('.dropdown-menu[role="combobox"]').removeClass("open");

    $("#cboContratista").change(function(){
        load_maquinarias("#cbo_maq", $(this).val());
    });


    $("#tab_actividades").on("click","label.buying-selling",function(){
        datos = $(this).data("json");
        div = $(this).closest(".row").find("input.costo").val(datos.precio.costo).change();
    });

    /*Actividades*/
    function _sumTotalAreas(elem){
        sum = 0;
        $(elem).closest(".content").find(".row:not(.hidden) .total-area").each(function (i, v_ta) {
            sum += parseFloat($(v_ta).val());
        });
        $(elem).closest(".content").closest(".row").find(".v_total-area").val(sum.toFixed(2)).change();
    }

    $("#tab_actividades").on("change", ".input-area", function () {
        SumarAreas(".input-area", ".contenedor-area", ".total-area", this);
    });
    $("#tab_actividades").on("change", ".total-area", function () {
        _sumTotalAreas($(this).closest(".content"));
    });

    $("#tab_actividades").on("change", "input[name='costo_actividad']", function () {
        sum = 0;
        $(this).closest(".row").find("input[name='costo_actividad']").each(function(i,input){
            sum *= parseFloat($(input).val());
        });
        $(this).closest(".row").find("input[name='total_actividad']").val(sum.toFixed(2));
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
                    $(actividad_sample).find("input.costo").val(sub_actividades[0].precio.costo).change();
                }
            }else{
                $.each(sub_actividades,function(i,sub_actividad){
                    op_subactividad = $(actividad_sample).find(".op_subactividad").clone();
                    $(op_subactividad).data("json",sub_actividad);
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
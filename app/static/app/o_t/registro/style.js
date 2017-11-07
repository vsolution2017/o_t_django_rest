imgs = [];
imgs_id = [];
_config_fileinput = {
            theme: 'fa',
            language: 'es',
            showUpload: false,
            uploadUrl: '/app/img/',
            allowedFileExtensions: ['jpg', 'png']
        };

$(function(){

    /* Inicial */
    $("#tab_maquinaria table").bootstrapTable();
    $("#tab_rubros table").bootstrapTable();
    $('#exTab2 select').selectpicker();
    //$(".day_date:not(.exclude)").datetimepicker("update",new Date());





    $("#_cod").val(gen_Cod());

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

    //$('.dropdown-menu[role="combobox"]').removeClass("open");

    /* Inicial */

    /* Inicio */

    $("#_save").click(function(){
        id = $("div[name='redimensionar']").attr("data-id");
        _type = "POST";
        _url = "/app/s_OrdenTrabajo/";
        if(id !== "0"){
            _type = "PUT";
            _url = _url + id;
        }
        $.ajax({
            url : _url,
            type: _type,
            data: get_save(),
            success: function (response) {
                console.log(response);
                //window.location.href = "/app/list_ot/";
            }
        });
    });


    $("#cboTipo_mantenimiento").change(function(e){
       $("#_cod").val(gen_Cod());
    });

    $("#myModal").on("hidden.bs.modal",function(e){
        $('input[name="_tiempo"]').val(get_tiempo_total()).change();
    });

    $("#myModal").on("show.bs.modal",function (e) {
        dateFechaInicio = $("#fechaInicio").val();
        dateFechaCierre = $("#fechaCierre").val();
        if(!$.isEmptyObject(dateFechaInicio) && !$.isEmptyObject(dateFechaCierre)){
        }else{
            e.preventDefault();
        }
    });

    $("#fechaInicio , #fechaCierre").change(function () {
        dateFechaInicio = $("#fechaInicio").val();
        dateFechaCierre = $("#fechaCierre").val();
        if(!$.isEmptyObject(dateFechaInicio) && !$.isEmptyObject(dateFechaCierre)){
            //console.log(dateFechaInicio +" "+ dateFechaCierre);
            dateI = moment(dateFechaInicio, "YYYY-MM-DD");
            dateC = moment(dateFechaCierre, "YYYY-MM-DD");
            duracion = dateC.diff(dateI, 'days');
            $("#contenedor").html("");
            for (var i = 0; i <= duracion; i++) {
                op_clone = $("#opcionD").clone();
                $(op_clone).find("input[type='text']").val(dateI.format("YYYY-MM-DD"));
                $(op_clone).removeClass("hidden");
                $("#contenedor").append(op_clone);
                dateI.add(1,"d");
            }
        }
    });

    /* Inicio */


    /* Maquinarias */

    $("#cboContratista").change(function(){
        load_maquinarias("#cbo_maq", $(this).val());
    });

    $("#tab_maquinaria").on("change", ".input-area", function () {
        SumarAreas(".input-area", ".contenedor-area", ".total-area-viaje", this);
    });

    $('input[name="_tiempo"]').change(function(e){
        rows = $.map($("#tab_maquinaria table").bootstrapTable('getData'), function (row) {
            row.total = get_costo_tiempo($(e.target).val(),row.costo) * row.cantidad;
            return row;
        });
        $("#tab_maquinaria table").bootstrapTable("load",rows);
        total_tabMaquinaria();
    });

    $("#btn_add_maq").click(function () {
        datos = cbo_option("#cbo_maq");
        console.log(datos);

        ids = $.map($("#tab_maquinaria table").bootstrapTable('getData'), function (row) {
            return row.id;
        });

        if($.inArray(datos.id,ids) == -1){
            tiempo = $('input[name="_tiempo"]').val();
            total = get_costo_tiempo(tiempo, parseFloat(datos.precio));
            $("#tab_maquinaria table").bootstrapTable("insertRow",{
                index: 0,
                row:{
                        id: datos.id,
                        cantidad: 1,
                        stock: datos.stock,
                        recurso: datos.maquinaria.descripcion,
                        costo:  parseFloat(datos.precio).toFixed(2),
                        total: total
                    }
            });
            total_tabMaquinaria();
        }
    });

    /* Maquinarias */

    /* Actividades */
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
            if(i == 0){
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

    $("#tab_actividades #btn_add_activity").click(function(){
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

    $("#tab_actividades").on("click","label.buying-selling:not(label.buying-selling input[type='checkbox'])",function(){
        datos = $(this).data("json");
        if(parseFloat(datos.precio) > 0){
            div = $(this).closest(".row").find("input.costo").val(parseFloat(datos.precio).toFixed(2)).change();
        }
    });

    $("#tab_actividades").on("change","label.buying-selling input[type='checkbox']",function(){
        total = $(this).closest(".buying-selling-group").find("input[type='checkbox']:checked").length;
        if(total > 0){
            datos = $(this).closest("label").data("json");
            precio = parseFloat(datos.precio);
            if($(this).is(":checked")){
                if(precio > 0){
                    $(this).closest(".row").find("input.costo").val(precio.toFixed(2)).change();
                }else if(parseFloat($(this).closest(".row").find("input.costo").val()) === 0){
                    $(this).closest(".row").find("input.costo").val(parseFloat(0.00)).change();
                }
            }else{
                valor = parseFloat($(this).closest(".row").find("input.costo").val());
                $(this).closest(".row").find("input.costo").val((valor - precio).toFixed(2)).change()
            }
        }else{
            $(this).closest(".row").find("input.costo").val(parseFloat(0.00)).change();
        }
    });
    /* Actividades */



    /* Fotos */
    $('#fotos').on('fileclear', function(event) {
        imgs = [];
        imgs_id = [];
    });

    $('#fotos').on('filepreremove', function(event, id, index) {
        i = $.inArray(id,imgs_id);
        imgs_id.splice(i,1);
        imgs.splice(i,1);
    });

    $('#fotos').on('fileloaded', function(event, file, previewId, index, reader) {
        imgs_id.push(previewId);
        imgs.push({
            nombre : file.name,
            tipo: file.type,
            datos: reader.result
        });
    });
    /* Fotos */


    load_Mantenimiento("#cboTipo_mantenimiento");
    load_Parroquia("#cboParroquia");
    load_Cargos(1,"#cbo_jefe");
    load_Cargos(2,"#cbo_coord");
    load_TipoActividad("#cboTipoActividad");
    load_contratista();

    editar = load_pag();
    //editar = true;
    if(!editar){
        $("#fotos").fileinput(_config_fileinput);
        $(".day_date:not(.exclude)").datetimepicker("update",new Date());
        load_maquinarias("#cbo_maq", $("#cboContratista").val());
    }



});


function input_number(value, row) {
    return '<input type="number" class="form-control input-sm" min="1" max="' + row.stock + '" value="'+ value +'" />';
}

function total_tabMaquinaria(total) {
    total = 0;
    $.each($("#tab_maquinaria table").bootstrapTable("getData"),function (i,row) {
        total+= parseFloat(row.total);
    });
    $("#tab_maquinaria input[name='costo_tab']").val(total.toFixed(2)).change();
}

window.input_numer_action = {
    'change input[type="number"]': function (e, value, row, index) {
        tiempo = $('input[name="_tiempo"]').val();
        row.total = get_costo_tiempo(tiempo,row.costo) * $(e.target).val();
        row.cantidad = parseInt($(e.target).val());
        table = $(this).closest("table");
        $(table).bootstrapTable('updateRow', {
            index : index,
            row : row
        });
        total_tabMaquinaria();
    }
};

function get_costo_tiempo(tiempo,costo){
    horas = moment(tiempo,"HH:mm");
    return ((horas.hour() * costo) + (horas.minute() * costo / 60)).toFixed(2);
}

function get_tiempo_total(){
    h_total = moment({ hour: 0, minute: 0 });
    $("#myModal #contenedor .row").each(function(i,div){
        h_inicio = moment($(div).find("input[name='h_inicio']").val(),"HH:mm");
        h_fin = moment($(div).find("input[name='h_fin']").val(),"HH:mm");
        hora = h_fin.diff(h_inicio,"hours");
        min = h_fin.diff(h_inicio,"minutes");
        min = min % 60;
        //h_row = moment({ hour: hora, minute: min });
        h_total.add(hora,"h");
        h_total.add(min,"m");
    });
    //console.log(h_total.format("HH:mm"));
    return h_total.format("HH:mm");
}

function SumarAreas(param1, param2, param3, param4) {
    producto = 1;
    $(param4).closest(param2).find(param1).each(function (i, value) {
        num = parseFloat($(value).val());
        if (num > 0) {
            producto *= num;
        }
    });
    $(param4).closest(param2).find(param3).val(producto.toFixed(2)).change();
}
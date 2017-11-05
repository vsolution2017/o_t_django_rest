function fechaFormat_URL(fecha){
    return moment(fecha).format("YYYYMMDD");
}

function cbo_option(cbo){
    data = $(cbo).find("option[value='"+ $(cbo).selectpicker("val") +"']").data("json");
    return $.isEmptyObject(data)? "":data;
}

function _sumTotalAreas(elem){
    sum = 0;
    $(elem).closest(".content").find(".row:not(.hidden) .total-area").each(function (i, v_ta) {
        sum += parseFloat($(v_ta).val());
    });
    $(elem).closest(".content").closest(".row").find(".v_total-area").val(sum.toFixed(2)).change();
}

function total_tabActividad() {
    total = 0;
    $.each($("#tab_actividades input[name='total_actividad']"),function (i,input) {
        total += parseFloat($(input).val());
    });
    $("#tab_actividades input[name='costo_tab']").val(total.toFixed(2)).change();
}

function load_Mantenimiento(cbo){
    url = '/app/list/mantenimiento/';
    $.ajax({
        url:url,
        type:'GET',
        async:false,
        success: function(response){
            $(cbo).html("");
            $(response).each(function(i,val){
                option = document.createElement("option");
                $(option).val(val.id);
                $(option).text(val.descripcion);
                $(option).data("json",val);
                $(cbo).append(option);
            });
            $(cbo).selectpicker('refresh');
        }
    });
}

function load_Parroquia(cbo){
    url = '/app/list/parroquia/';
    $.ajax({
        url: url,
        type:'GET',
        async:false,
        success: function(response){
            result = '';
            $(cbo).html(result);
            $(response).each(function(i,val){
                result+= '<option value="'+ val.id +'">'+ val.descripcion +'</option>';
            });
            $(cbo).html(result);
            $(cbo).selectpicker('refresh');
        }
    });
}

function load_TipoActividad(cbo){
    url = '/app/list/actividad/';
    $.ajax({
        url: url,
        type:'GET',
        async:false,
        success: function(response){
            $(response).each(function(i,val){
                option = document.createElement("option");
                $(option).val(val.id);
                $(option).text(val.descripcion);
                $(option).data("json",val);
                $(cbo).append(option);
            });

            $(cbo).selectpicker('refresh');
        }
    });
}

function getSubActividades(id_actividad){
    fecha = fechaFormat_URL($("#fechaInicio").val());
    response = null;
    $.ajax({
        url: ('/app/sub_actividad/' + id_actividad+'/'+fecha) ,
        type: 'GET',
        async:false,
        success: function(result){
            response = result;
        }
    });
    return response;
}

function load_contratista(){
    $.ajax({
        url: '/app/contratista/',
        type: 'GET',
        async:false,
        success: function(result){
            append = "";
            $(result).each(function(i,val){
                append += '<option value="'+ val.id +'">'+ val.nombres +'</option>';
            });
            $("#cboContratista").html(append);
            $("#cboContratista").selectpicker("refresh");
            //$("#cboContratista").change();
            //load_maquinarias("#cbo_maq", $("#cboContratista").val());
        }
    });
}

function load_maquinarias(cbo,contratista){
    fecha = fechaFormat_URL($("#fechaInicio").val());
    $.ajax({
        url: '/app/maquinarias/' + contratista +'/'+fecha,
        type: 'GET',
        async:false,
        success: function(result){
            $(cbo).html("");
            $(result).each(function(i,val){
                option = document.createElement("option");
                $(option).val(val.maquinaria.id);
                $(option).text(val.maquinaria.descripcion);
                $(option).data("json",val);
                $(cbo).append(option);
            });
            $(cbo).selectpicker("refresh");
        }
    });
}

function load_Cargos(id,cbo){
    $.ajax({
        url: '/app/cargo/' + id ,
        type: 'GET',
        success: function(result){
            $(cbo).html("");
            $(result).each(function(i,val){
                option = document.createElement("option");
                //console.log(val);
                $(option).val(val.id);
                $(option).text(val.h.apellidos + " " + val.h.nombres);
                $(option).data("json",val);
                $(cbo).append(option);
                //append += '<option value="'+ val.maquinaria.id +'">'+ val.maquinaria.descripcion +'</option>';
            });
            $(cbo).selectpicker("refresh");
        }
    });
}

function get_TabInicio(){
    tab_inicio = {
        tipo_mantenimiento : $("#cboTipo_mantenimiento").selectpicker("val"),
        fecha_pedido : $("#f_pedido").val(),
        fecha_planificada : $("#f_planificada").val(),
        fecha_inicio: $("#fechaInicio").val(),
        fecha_cierre:  $.isEmptyObject($("#fechaCierre").val())? null:$("#fechaCierre").val() ,
        parroquia : $("#cboParroquia").selectpicker("val"),
        direccion : $("#i_direccion").val(),
        descripcion_problema : $("#i_problema").val(),
        observacion : "",
        cod_crav : $("#_cod").val(),
    };
    t_fecha_horas = [];
    $("#myModal .modal-body #contenedor .modal_horas").each(function(i,div_horas){
        t_fecha_horas.push({
            fecha : $(div_horas).find("input[name='fecha']").val(),
            hora_entrada: $(div_horas).find("input[name='h_inicio']").val(),
            hora_salida: $(div_horas).find("input[name='h_fin']").val()
        });
    });
    $.extend(tab_inicio,{
        horas : JSON.stringify(t_fecha_horas)
    });
    /*if($("div[name='redimensionar']").attr("data-id") !== "0"){
        $.extend(tab_inicio,{
            id : $("div[name='redimensionar']").attr("data-id")
        });
    }*/

    return tab_inicio;
}

function get_TabActividades(){
    actividades = [];
    $("#cont-actividades div[name='_actividades']").each(function(i,div_actividad){
        datos = $(div_actividad).data("json");
        sub_actividades = $(div_actividad).data("sub_actividades");
        subs = [];
        if(sub_actividades.length > 1){
            $(div_actividad).find(".buying-selling-group label:not('.hidden')").each(function (i,label) {
               if($(label).hasClass("active")){
                   data_sub = $(label).data("json");
                   subs.push({
                    id :data_sub.id
                   });
               }
            });
        }
        else{
            subs.push({
                    id :sub_actividades[0].id
                   });
        }
        actividades.push({
            tipo_actividad: datos.id,
            sub_actividades: JSON.stringify(subs),
            areas: JSON.stringify(get_Areas($(div_actividad).find(".content")))
        });
    });
    return actividades;
}

function get_Areas(content){
    areas = [];
    $(content).find(".row:not('.hidden')").each(function(i,row){
        area = {
            nombre: $(row).find('input[name="nom_area"]').val()
        };

        $(row).find(".contenedor-area input.input-area").each(function(i,input){
            //Validar valores en 0
            json = '{ "v'+ (i + 1) +'" : "'+ $(input).val() +'" }';
            $.extend(area,JSON.parse(json));
        });
        areas.push(area);
    });
    return areas;
}

function get_TabMaquinarias(){
    data_tb = $("#tab_maquinaria table").bootstrapTable("getData");
    data = $.map(data_tb,function (row) {
       return {
           cantidad : row.cantidad,
           contratista_maquinaria : row.id
       };
    });
    return data;
}

function get_save(){
    return  $.extend({},get_TabInicio(),{
        maquinarias : JSON.stringify(get_TabMaquinarias()),
        actividades : JSON.stringify(get_TabActividades()),
        detalle : JSON.stringify([{
            horas_totales : $("#tab_maquinaria input[name='_tiempo']").val()
        }]),
        fotos: JSON.stringify(imgs)
    });
}

function get_Rubros() {
    $.ajax({
        url : "/app/s_rubro_orden/",
        type : "GET",
        success : function (response) {
            //console.log()
        }
    });
}

function gen_Cod() {
    _tipo = "MNT";
    parroquia = "QVD";
    t_mantenimiento = cbo_option("#cboTipo_mantenimiento").abr;
    fecha = moment().format("YYYYMMDD");
    return ["CRAV",_tipo,parroquia,"OTR",t_mantenimiento,fecha].join("-");
}

function load_pag(){
    editar = false;
    id = $("div[name='redimensionar']").attr("data-id");
    if(id !== "0"){
        $.ajax({
            url: "/app/s_OrdenTrabajo/"+ id,
            type: "GET",
            async: false,
            success: function (response) {
                setOrden(response.orden);
                setHoras(response.horas);
                setMaquinaria(response.maquinaria);
                setActividad(response.actividades);
                setFotos(response.fotos);
                editar = true;
            }
        });
    }
    return editar;
}

function _getDate(field,fecha) {
    if (!$.isEmptyObject(fecha)){
        $(".day_date[data-link-field='"+ field +"']").datetimepicker("update",moment(fecha).toDate());
    }
}

function setOrden(orden){
    $("#cboTipo_mantenimiento").selectpicker("val",orden.tipo_mantenimiento);
    $("#cboParroquia").selectpicker("val",orden.parroquia);

    _getDate('f_planificada',orden.fecha_planificada);
    _getDate('f_pedido',orden.fecha_pedido);
    _getDate('fechaInicio',orden.fecha_inicio);
    _getDate('fechaCierre',orden.fecha_cierre);

    $("#i_direccion").val(orden.direccion);
    $("#i_problema").val(orden.descripcion_problema);

    $("#_cod").val(orden.cod_crav);

}

function setHoras(horas) {
    if (horas.length > 0){
        $("#fechaCierre").change();
        $.each(horas,function (i,hora) {
            row_horas = $("#contenedor .modal_horas:eq("+ i + ")");
            $(row_horas).find("input[name='h_inicio']").val(hora.hora_entrada);
            $(row_horas).find("input[name='h_fin']").val(hora.hora_salida);
            //$(row_horas).data("id",hora.id);
        });
         $('input[name="_tiempo"]').val(get_tiempo_total()).change();
    }
}

function setMaquinaria(maquinarias) {
    if(maquinarias.length > 0){
        $.each(maquinarias,function (i,maquinaria) {
            $("#cboContratista").selectpicker("val",maquinaria.contratista_maquinaria.contratista).change();
            $("#cbo_maq").selectpicker("val",maquinaria.contratista_maquinaria.maquinaria.id);
            $("#btn_add_maq").click();
        });
    }
    else{
        $("#cboContratista").change();
    }

    //load_maquinarias("#cbo_maq", $("#cboContratista").val());
}

function setActividad(_actividades) {
    $.each(_actividades,function (i,actividad) {
        _sub_actividades = $.map(JSON.parse(actividad.sub_actividades),function (sub) {
            return sub.id;
        }) ;
        $("#cboTipoActividad").selectpicker("val",actividad.tipo_actividad);

        $("#btn_add_activity").click();

        //actividades = $("#cont-actividades").data("actividades");
        console.log(actividades);
        index = $.inArray(actividad.tipo_actividad,actividades);
        _div_actividad = "#cont-actividades div[name='_actividades']:eq("+ index +")";

        $.each(_sub_actividades,function (i,sub) {
            $(_div_actividad +" .buying-selling-group label[data-id='"+ sub +"']")
                .addClass("active")
                .click();
        });

        $.each(actividad.areas,function (i,area) {
           $(_div_actividad + " button[name='btn_area']").click();
           $(_div_actividad + " .add_area:eq(" + i + ") input[name='nom_area']").val(area.nombre);
           $(_div_actividad + " .add_area:eq(" + i + ") .input-area:eq(0)").val(area.v1).change();
           $(_div_actividad + " .add_area:eq(" + i + ") .input-area:eq(1)").val(area.v2).change();
           $(_div_actividad + " .add_area:eq(" + i + ") .input-area:eq(2)").val(area.v3).change();
        });
    });
}

function setFotos(fotos) {
    initPreview = [];
    initPreviewConfig= [];
    $.each(fotos,function (i,row) {
        initPreview.push(row.datos);
        initPreviewConfig.push({
            caption: row.nombre, size: 329892, width: "120px", url: "/app/d_img/", key: i, extra: {id: row.id}
        });
    });

    $('#fotos').fileinput($.extend({},_config_fileinput,{
        initialPreviewAsData: true,
        overwriteInitial: false,
        initialPreview: initPreview,
        initialPreviewConfig: initPreviewConfig
    }));
}

/*function load_rubros(fecha){
    fecha1 = moment(fecha);
    fecha1.set("date",1);
    console.log(fecha1.format("YYYYMMDD"));
    $.ajax({
        url: '/app/s_PrecioRubro/'+fecha1.format("YYYYMMDD")+'/date',
        type:'GET',
        async: false,
        success: function(response){
            data = JSON.parse(response.precio_rubro.valores);
            //Transporte
            transporte = data.transporte;
            t_transporte = (transporte.t_km * transporte.v_km);
            $("#tb_rTransporte").bootstrapTable("insertRow",{ index: 1 , row : {n : 1,
                descripcion: "Transporte",
                total: t_transporte}});
            //Seguridad
            seguridad = data.seguridad;
            t_seguridad = (seguridad.t_si * seguridad.c_hombre) / response.cantidad_ot
            $("#tb_rSeguridad").bootstrapTable("insertRow",{ index: 1 , row : {n : 1,
                descripcion: "Seguridad",
                total: t_seguridad }});

            //Operaciones
            operaciones = data.operacion;
            t_operaciones = operaciones.porcentaje_op ;
            $("#tb_rOperaciones").bootstrapTable("insertRow",{ index: 1 , row : {n : 1,
                descripcion: "Operaciones",
                total: t_operaciones}});

            //RRHH
            rrhh = data.rrhh;
            $("#tb_rRRHH").bootstrapTable("insertRow",{ index: 1 , row : {n : 1,
                descripcion: "Personal",
                total: rrhh.promedio}});

        }
    });
}*/
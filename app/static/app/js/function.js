function load_rubros(fecha){
    fecha1 = moment(fecha);
    fecha1.set("date",1);
    console.log(fecha1.format("YYYYMMDD"));
    $.ajax({
        url: '/app/s_PrecioRubro/'+fecha1.format("YYYYMMDD")+'/date',
        type:'GET',
        async: false,
        success: function(response){
            data = JSON.parse(response.precio_rubro.valores);
            console.log(response);
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
            t_operaciones = operaciones.porcentaje_op * (t_transporte + t_seguridad);
            $("#tb_rOperaciones").bootstrapTable("insertRow",{ index: 1 , row : {n : 1,
                descripcion: "Operaciones",
                total: t_operaciones}});

        }
    });
}

function cbo_option(cbo){
    data = $(cbo).find("option[value='"+ $(cbo).selectpicker("val") +"']").data("json");
    return $.isEmptyObject(data)? "":data;
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
    response = null;
    $.ajax({
        url: ('/app/sub_actividad/' + id_actividad) ,
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
            $("#cboContratista").change();
            load_maquinarias("#cbo_maq", $("#cboContratista").val());
        }
    });
}

function load_maquinarias(cbo,contratista){
    $.ajax({
        url: '/app/maquinarias/' + contratista ,
        type: 'GET',
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
        parroquia : $("#cboParroquia").selectpicker("val"),
        direccion : $("#i_direccion").val(),
        descripcion_problema : $("#i_problema").val(),
        observacion : "",
        cod_crav : $("#_cod").val()
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
        actividades : JSON.stringify(get_TabActividades())
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

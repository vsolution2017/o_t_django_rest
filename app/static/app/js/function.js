function generar_horarios(){

}
function cbo_option(cbo){
    return $(cbo).find("option[value='"+ $(cbo).selectpicker("val") +"']").data("json");
}

function load_Mantenimiento(cbo){
    url = '/app/list/mantenimiento/';
    $.ajax({
        url:url,
        type:'GET',
        //async:false,
        success: function(response){
            $(cbo).html("");
            $(response).each(function(i,val){
                option = document.createElement("option");
                $(option).val(val.id);
                $(option).text(val.descripcion);
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
        //async:false,
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
        f_pedido : $("#f_pedido").val(),
        f_planificada : $("#f_planificada").val(),
        fechaInicio : $("#fechaInicio").val(),
        fechaCierre : $("#fechaCierre").val(),
        horas: null,
        cbo_jefe : $("#cbo_jefe").selectpicker("val"),
        cbo_coord : $("#cbo_coord").selectpicker("val"),
        cboParroquia : $("#cboParroquia").selectpicker("val"),
        i_direccion : $("#i_direccion").val(),
        i_problema : $("#i_problema").val()
    };
    t_fecha_horas = [];
    $("#myModal .modal-body #contenedor .modal_horas").each(function(i,div_horas){
        t_fecha_horas.push({
            fecha : $(div_horas).find("input[name='fecha']").val(),
            h_inicio: $(div_horas).find("input[name='h_inicio']").val(),
            h_fin: $(div_horas).find("input[name='h_fin']").val()
        });
    });
    $.extend(tab_inicio,{
        horas : t_fecha_horas
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
                       id_sub : data_sub.id,
                       precio : $(div_actividad).find("input[name='costo_actividad']").val()
                   });
               }
            });
        }
        else{
            subs.push({
                id_sub : sub_actividades[0].id,
                precio : $(div_actividad).find("input[name='costo_actividad']").val()
            });
        }
        $.each(subs,function(i,sub){
            $.extend(sub, { areas: get_Areas($(div_actividad).find(".content")) } );
        });

        actividades.push({
            id: datos.id,
            sub_actividad: subs
        });
    });
    return actividades;
}

function get_Areas(content){
    areas = [];
    $(content).find(".row:not('.hidden')").each(function(i,row){
        area = {
            area: $(row).find('input[name="nom_area"]').val()
        };

        $(row).find(".contenedor-area input.input-area").each(function(i,input){
            //Validar valores en 0
            json = '{ "v_'+ (i + 1) +'" : "'+ $(input).val() +'" }';
            $.extend(area,JSON.parse(json));
        });
        areas.push(area);
    });
    return areas;
}

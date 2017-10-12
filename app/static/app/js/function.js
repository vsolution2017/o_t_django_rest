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
                //append += '<option value="'+ val.maquinaria.id +'">'+ val.maquinaria.descripcion +'</option>';
            });
            $(cbo).selectpicker("refresh");
        }
    });
}
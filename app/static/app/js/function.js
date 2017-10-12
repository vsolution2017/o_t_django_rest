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
function load_contratista(){
    $.ajax({
        url: '/app/contratista/',
        type: 'GET',
        async:false,
        success: function(result){
            console.log(result);
            append = "";
            $(result).each(function(i,val){
                append += '<option value="'+ val.id +'">'+ val.nombres +'</option>';
            });
            $("#cboContratista").html(append);
            $("#cboContratista").selectpicker("refresh");
        }
    });
}
function load_maquinarias(cbo){
    $.ajax({
        url: '/app/maquinarias/' + $(cbo).val() ,
        type: 'GET',
        success: function(result){
            $("#cbo_maq").html("");
            append = "";
            $(result).each(function(i,val){
                append += '<option value="'+ val.maquinaria.id +'">'+ val.maquinaria.descripcion +'</option>';
            });
            $("#cbo_maq").html(append);
            $("#cbo_maq").selectpicker("refresh");
        }
    });
}
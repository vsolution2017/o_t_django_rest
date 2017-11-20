function getData(update){
    datos = {
        rol: $("#cboRol").selectpicker("val"),
        usuario: $("#txtUser").val().toLowerCase()
    };
    if(!$.isEmptyObject($("#txtPass").val()) && update){
        $.extend(datos,
            {
                password: $("#txtPass").val()
            });
    }else if($.isEmptyObject($("#txtPass").val()) && !update){
        return false;
    }else if(!$.isEmptyObject($("#txtPass").val()) && !update){
        $.extend(datos,
            {
                password: $("#txtPass").val()
            });
    }
    return datos;
}
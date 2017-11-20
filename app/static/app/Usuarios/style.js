/**
 * Created by kebryan on 19/11/2017.
 */
$(function () {
    $("table").bootstrapTable();
    $("table").bootstrapTable("hideColumn","id_rol");

    $("#add-user").on("hidden.bs.modal",function (e) {
        $("#_save").data("id",null);
        $(this).find("input").val("");
    });

    $("#_save").click(function (e) {
       metodo = "POST";
       id = "";
       update = false;
       if(!$.isEmptyObject($(this).data("id"))){
           metodo = "PUT";
           id = $(this).data("id");
           update = true;
       }
       datos = getData(update);
       if(datos === false){
           alert("Usuario debe asignar una contraseña");
       }else{
           console.log(datos);
            $.ajax({
               url: "/app/usuarios/"+id,
               type: metodo,
               data: datos,
               success: function (response) {
                   if(response.status){
                       window.location.reload();
                   }else{
                       alert(response.message);
                   }
               }
           });
       }
    });
});



function btn_accion(){
    return ''+
        '<button class="btn btn-sm btn-primary" name="edit" data-toggle="modal" data-target="#add-user"><i class="fa fa-edit"></i> Editar</button> '+
        '<button class="btn btn-sm btn-danger" name="delete"><i class="fa fa-trash"></i> Eliminar</button>';
}

window.event_accion = {
    'click button[name="edit"]' : function (e, value, row, index) {
        $("#cboRol").selectpicker("val",row.id_rol);
        $("#txtUser").val(row.user);
        $("#_save").data("id", row.id);
    },
    'click button[name="delete"]' : function (e, value, row, index) {
        $.ajax(
            {
                url: "/app/usuarios/"+ row.id,
                type: "DELETE",
                success: function (response) {
                    if(response.status){
                       window.location.reload();
                   }else{
                       alert(response.message);
                   }
                }
            });
    }
};
function load_OrdenTrabajo(){
    $.ajax({
        url : "/app/s_OrdenTrabajo/",
        dataType: "json",
        success: function (data) {
            $("table").bootstrapTable("load",data);
        }
    });
}

function btn_accion(){
    buttons =
        '<button name="edit" class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></button> '+
        '<button name="del" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button> ';
    return buttons;
}
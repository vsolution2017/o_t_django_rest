function input_format(value,row) {
    console.log(row);
    //value = $.isEmptyObject(value) ? "" : value;
    return '<input type="number" min="1" max="'+ row.stock +'" class="form-control text-center" style="width:100px;" value="' + value + '" >';
}

function btn() {
    return "<button name='add' class='btn btn-sm btn-success'><i class='fa fa-plus'></i></button>";
}
window.btn_accion= {
    "click button[name='add']" : function (e, value, row, index) {
        $(this).closest()


        $("#tb_material").bootstrapTable("insertRow",
            {
                index:0,
                row :{
                    cod : row.id,
                    descripcion: row.nombre,
                    cantidad: 1,
                    v_unit: 0,
                    stock: row.stock
                }
            })
    }
};
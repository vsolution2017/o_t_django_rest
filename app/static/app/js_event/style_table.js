function input_format(value,row) {
    return '<input type="number" min="1" max="'+ row.stock +'" class="form-control text-center" style="width:100px;" value="' + value + '" >';
}

function btn() {
    return "<button name='add' class='btn btn-sm btn-success'><i class='fa fa-plus'></i></button>";
}
window.btn_accion= {
    "click button[name='add']" : function (e, value, row, index) {
        ids = $.map($("#tb_material").bootstrapTable("getData"),function (data) {
            return data.cod;
        });
        if($.inArray(row.id,ids) === -1){
            $("#tb_material").bootstrapTable("insertRow",
            {
                index: ids.length,
                row :{
                    cod : row.id,
                    descripcion: row.nombre,
                    cantidad: 1,
                    v_unit: 0,
                    stock: row.stock
                }
            });
        }
    },
    "change [type='number']": function (e, value, row, index) {
        cantidad = parseInt($(e.target).val());
        row.cantidad = cantidad;
        table = $(this).closest("table");
        $(table).bootstrapTable('updateRow', {
            index : index,
            row : row
        });
    }
};
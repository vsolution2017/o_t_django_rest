function input_number(value, row) {
    return '<input type="number" class="form-control input-sm" min="1" max="' + row.stock + '" value="'+ value +'" />';
}
function total_tabMaquinaria(total) {
    total = 0;
    $.each($("#tab_maquinaria table").bootstrapTable("getData"),function (i,row) {
        total+= parseFloat(row.total);
    });
    $("#tab_maquinaria input[name='costo_tab']").val(total.toFixed(2)).change();
}
window.input_numer_action = {
    'change input[type="number"]': function (e, value, row, index) {
        tiempo = $('input[name="_tiempo"]').val();
        row.total = get_costo_tiempo(tiempo,row.costo) * $(e.target).val();
        row.cantidad = parseInt($(e.target).val());
        table = $(this).closest("table");
        $(table).bootstrapTable('updateRow', {
            index : index,
            row : row
        });
        total_tabMaquinaria();
    }
};
function get_costo_tiempo(tiempo,costo){
    horas = moment(tiempo,"HH:mm");
    return ((horas.hour() * costo) + (horas.minute() * costo / 60)).toFixed(2);
}
function get_tiempo_total(){
    h_total = moment({ hour: 0, minute: 0 });
    $("#myModal #contenedor .row").each(function(i,div){
        h_inicio = moment($(div).find("input[name='h_inicio']").val(),"HH:mm");
        h_fin = moment($(div).find("input[name='h_fin']").val(),"HH:mm");
        hora = h_fin.diff(h_inicio,"hours");
        min = h_fin.diff(h_inicio,"minutes");
        min = min % 60;
        //h_row = moment({ hour: hora, minute: min });
        h_total.add(hora,"h");
        h_total.add(min,"m");
    });
    //console.log(h_total.format("HH:mm"));
    return h_total.format("HH:mm");
}

$(function () {
    //$(":input").inputmask();

    $("#myModal").on("hidden.bs.modal",function(e){
        $('input[name="_tiempo"]').val(get_tiempo_total()).change();
    });

    /* Style Tab Maquinas*/
    $("#tab_maquinaria").on("change", ".input-area", function () {
        SumarAreas(".input-area", ".contenedor-area", ".total-area-viaje", this);
    });
    $("#tab_maquinaria").on("change", ".total-area-viaje", function () {
        SumarCosto(".content .row:not(.hidden) .total-area-viaje", ".actividad_sample", ".total_viajes", this, 1);
    });
    $("#tab_actividades").on("change", ".input-area", function () {
        SumarAreas(".input-area", ".contenedor-area", ".total-area-pav", this);
    });
    $("#tab_actividades").on("change", ".total-area-pav", function () {
        SumarCosto(".content .row:not(.hidden) .total-area-pav", ".actividad_sample", ".total-pavimento", this, 2);
    });

    $("#fechaInicio , #fechaCierre").change(function () {
        dateFechaInicio = $("#fechaInicio").val();
        dateFechaCierre = $("#fechaCierre").val();

        if(!$.isEmptyObject(dateFechaInicio) && !$.isEmptyObject(dateFechaCierre)){
            //console.log(dateFechaInicio +" "+ dateFechaCierre);
            dateI = moment(dateFechaInicio, "YYYY-MM-DD");
            dateC = moment(dateFechaCierre, "YYYY-MM-DD");
            duracion = dateC.diff(dateI, 'days');
            $("#contenedor").html("");
            for (var i = 0; i <= duracion; i++) {
                op_clone = $("#opcionD").clone();
                $(op_clone).find("input[type='text']").val(dateI.format("YYYY-MM-DD"));
                $(op_clone).removeClass("hidden");
                $("#contenedor").append(op_clone);
                dateI.add(1,"d");
            }
        }
    });

    $("#myModal").on("show.bs.modal",function (e) {
        dateFechaInicio = $("#fechaInicio").val();
        dateFechaCierre = $("#fechaCierre").val();
        if(!$.isEmptyObject(dateFechaInicio) && !$.isEmptyObject(dateFechaCierre)){
        }else{
            e.preventDefault();
        }
    });

    $('input[name="_tiempo"]').change(function(e){
        rows = $.map($("#tab_maquinaria table").bootstrapTable('getData'), function (row) {
            row.total = get_costo_tiempo($(e.target).val(),row.costo) * row.cantidad;
            return row;
        });
        $("#tab_maquinaria table").bootstrapTable("load",rows);
        total_tabMaquinaria();
    });

    $("#btn_add_maq").click(function () {
        datos = cbo_option("#cbo_maq");
        ids = $.map($("#tab_maquinaria table").bootstrapTable('getData'), function (row) {
            return row.id;
        });

        if($.inArray(datos.id,ids) == -1){
            tiempo = $('input[name="_tiempo"]').val();
            total = get_costo_tiempo(tiempo, parseFloat(datos.precio));
            $("#tab_maquinaria table").bootstrapTable("insertRow",{
                index: 0,
                row:{
                        id: datos.id,
                        cantidad: 1,
                        stock: datos.stock,
                        recurso: datos.maquinaria.descripcion,
                        costo:  parseFloat(datos.precio).toFixed(2),
                        total: total
                    }
            });
            total_tabMaquinaria();
        }
    });






    /* Carlos */
    /*Maquinarias */
    $("#tab_maquinaria").on("click", ".delete", function () {
        $(this).closest(".row").remove();
    });

    $("#tab_maquinaria").on("click", ".edit", function () {
        $(this).removeClass("btn-info");
        $(this).addClass("btn-success");
        $(this).find("i").removeClass("fa-pencil");
        $(this).find("i").addClass("fa-floppy-o");
        $(this).closest(".input-group").find("input").removeAttr('readonly');
        $(this).removeClass("edit");
        $(this).addClass("save");
    });

    $("#tab_maquinaria").on("click", ".save", function () {
        $(this).addClass("btn-info");
        $(this).removeClass("btn-success");
        $(this).find("i").addClass("fa-pencil");
        $(this).find("i").removeClass("fa-floppy-o");
        $(this).closest(".input-group").find("input").attr('readonly', 'readonly');
        $(this).addClass("edit");
        $(this).removeClass("save");
    });


});

function SumarAreas(param1, param2, param3, param4) {
        producto = 1;
        $(param4).closest(param2).find(param1).each(function (i, value) {
            num = parseFloat($(value).val());
            if (num > 0) {
                producto *= num;
            }
        });
        $(param4).closest(param2).find(param3).val(producto.toFixed(2)).change();
    }


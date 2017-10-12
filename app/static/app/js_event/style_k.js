$(function () {
    load_contratista();
    load_Mantenimiento("#cboTipo_mantenimiento");
    load_Parroquia("#cboParroquia");
    load_TipoActividad("#cboTipoActividad");

    $('#exTab2 select').selectpicker();
    $('#exTab2 select').selectpicker("val",0);
    $('.dropdown-menu[role="combobox"]').removeClass("open");

    $("#cboContratista").change(function(){
        load_maquinarias($(this));
    });
});
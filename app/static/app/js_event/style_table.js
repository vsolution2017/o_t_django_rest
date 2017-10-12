function input_format(value) {
    value = $.isEmptyObject(value) ? "" : value;
    return '<input type="text" class="form-control text-center" style="width:100px;" value="' + value + '" >';
}
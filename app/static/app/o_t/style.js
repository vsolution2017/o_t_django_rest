$(function(){
    $("table").bootstrapTable();
    $("#btn_test").click(function(){
        $.ajax({
            url:"/app/test/",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                test : {
                    id: 0,
                    nombre: "kevin bryan"
                },
                test_2:{
                    nombre: "felipahosg"
                }
            }) ,
            type: "POST",
            success: function (data) {
                console.log(data);
            }
        });
    });
});
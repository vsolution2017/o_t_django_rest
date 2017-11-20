$(function () {
   $("#frmInicioSesion").submit(function (e) {
       //e.preventDefault();
       data = {
           user: $("#user").val(),
           pass: $("#pass").val()
       };
       $.ajax({
           url: '/app/autenticar/',
           type: 'POST',
           data: data,
           async:false,
           success: function (response) {
               //alert(response.status);
               if(response.status){
                   //alert("Login correcto");
               }
               else{
                   e.preventDefault();
                   alert("Error en credenciales");
               }
           }
       });

   });
});
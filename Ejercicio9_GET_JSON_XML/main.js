"use strict";
let xmlHttp;

$(function() {
  xmlHttp = crearConexion();
  if (xmlHttp) {
    //establecer el evento al botón
    $("#regiones").on("change", cargar);
  } else {
    alert("El navegador no soporta AJAX");
  }
});
function cargar() {
  if ($("#regiones").prop("selectedIndex") != 0) {
    xmlHttp.open("GET","Ejemplo9.php?ca=" + $("#regiones option:selected").val(), true);
    xmlHttp.onreadystatechange = mostrar;
    xmlHttp.send(); //comienza la conexión
  }
}

function mostrar() {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    let datos = JSON.parse(xmlHttp.responseText);
    console.log(datos)
    $(datos).each(function(ind, ele){
      mensaje+= ele+ "<br>";
    })
   $("#mostrar").html(mensaje);
   }
}

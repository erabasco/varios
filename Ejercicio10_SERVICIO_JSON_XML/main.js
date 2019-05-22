"use strict";
let xmlHttp;

$(function () {
    xmlHttp = crearConexion();
    if (xmlHttp) {
        //establecer el evento al botón
       cargar();

    } else {
        alert("El navegador no soporta AJAX");
    }
})

function cargar() {
   
    xmlHttp.open("GET", "https://raw.githubusercontent.com/IagoLast/pselect/master/data/provincias.json", true);
    //preparar el evento.
    xmlHttp.onreadystatechange = enviar;
    xmlHttp.send();
}

function enviar() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        let datos = JSON.parse(xmlHttp.responseText);
        //cargar la select
        //ordenar datos
        datos.sort(function(a,b){
            if (a.nm>b.nm){
                return 1;
            }else if(a.nm<b.nm){
                return -1;
            } else{
                return 0;
            }
        })
        console.log(datos)
        $(datos).each(function (ind, ele){
            $("#provincias").append("<option>"+ ele.nm+ "</option")
        })
        cargarTabla(datos);
       
    } else {
       // Swal.fire("Provincias", "Error de carga", "error")
    }
}
function cargarTabla(datos){
    //dibujar la tabla
  $("#mostrar").append("<table class='table'><thead class='thead-dark'>"+
    "<tr><th scope='col'>Id Provincial</th>"+
     "<th scope='col'>Descripción</th></tr></thead><tbody></tbody></table>");
   
    $(datos).each(function(ind, ele){
        $(".table").append("<tr><td>"+ ele.id+"</td><td>"+ele.nm+ "</td></tr>")
    })
}
"use strict";
let xmlHttp;

window.addEventListener("load", function () {
    xmlHttp = crearConexion();
    if (xmlHttp) {
        //establecer el evento al botón
        document.getElementById("boton").addEventListener("click", cargar);

    } else {
        alert("El navegador no soporta AJAX");
    }
})

function cargar() {

    xmlHttp.open("POST", "Ejemplo5.xml", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //preparar el evento.
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let datos= xmlHttp.responseXML;
            let mensaje="";
            //extraer el 2º curso
            let curso=datos.getElementsByTagName("curso")[1];
            //extraer los módulos
            let modulos=curso.getElementsByTagName("asig");
           //recorrer todos los módulos y guardarlo en una variable
            for (let ele of modulos){
                mensaje+= ele.firstChild.nodeValue+ "<br>";
            }
             document.getElementById("mensaje").innerHTML = mensaje;
        }
    }
    xmlHttp.send(); //comienza la conexión
}




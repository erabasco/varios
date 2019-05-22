/*  Al entrar en la web cargar las zonas.
    Introducir DNI (validando los valores del formulario)
    seleccionar una zona
    elegir nº de habitaciones y el precio máximo
  
    Una vez rellenos los valores del formulario mostrar en una tabla los inmuebles que cumplan la condición

    utilizar: XMLHttpRequest
    Guardar en la tabla reservas aquellos inmuebles que se seleccionen
*/

"use strict"

var xmlHttp;
var fila;


// cuando esté cargada la página
$(function () {
    cargarZonas();
    // si pulsamos sobre buscar validamos antes que todo esté relleno
    $(".boton").click(function () {
        // añadimos un nuevo metodo a validator - Luis
        $.validator.addMethod("dni", function (valor, item, parametros) {

            let dni = valor;
            let numero;
            let letra1;
            let letra2;
            let expresion_regular_dni;
            let valido = false;

            expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

            if (expresion_regular_dni.test(dni) == true) {
                numero = dni.substr(0, dni.length - 1);
                letra1 = dni.substr(dni.length - 1, 1);
                numero = numero % 23;
                letra2 = 'TRWAGMYFPDXBNJZSQVHLCKET';
                letra2 = letra2.substring(numero, numero + 1);
                if (letra2 != letra1.toUpperCase()) {
                    valido = false;
                } else {
                    valido = true;
                }
            } else {
                valido = false;
            }

            return valido;
        }, "Inválido");
        validarFormulario();
    })
});


function cargarZonas() {
    xmlHttp = crearConexion();
    if (xmlHttp) {
        xmlHttp.open("POST", "php/zonas.php", true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = mostrarZonas;
        xmlHttp.send();
    } else {
        Swal.fire("No soporta Ajax");
    }
}

function crearConexion() {
    let objeto;
    if (window.XMLHttpRequest) {
        objeto = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            objeto = new ActiveXObject("MSXML2.XMLHTTP");
        } catch (e) {
            objeto = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return objeto;
}

function mostrarZonas() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        let zonas = JSON.parse(xmlHttp.responseText);
        console.log(zonas);
        $(zonas.datos).each(function (ind, ele) {
            $("#zona").append("<option value=" + ele.idzona + ">" + ele.descripcion + "</option>");
        })
    }
}

function validarFormulario() {
    $(".formInmo").validate({
        rules: {
            dni: {
                required: true,
                dni: true
            },
            zona: "required",
            numhab: "required",
            precio: "required"
        },
        messages: {
            dni: {
                required: "El dato es requerido",
                dni: "DNI incorrecto",
            },
            zona: "Campo requerido",
            numhab: "Campo requerido",
            precio: "Campo requerido",
        },
        submitHandler: function (form) {
            mostrarInmuebles();
        }
    });
}



function mostrarInmuebles() {
    // mostramos inmuebles que coincidan con los datos que le pasamos en el formulario
    $.ajax({
        url: "php/inmuebles.php",
        data: {
            zona: $("#zona option:selected").val(),
            habitaciones: $(":radio:checked").val(),
            precio: $("#precio option:selected").val()
        }
    })

        // si todo es correcto dibujamos la tabla con los resultados
        .done(function (pisos) {
            // borro la tabla por si existiera previamente
            $("#tablaInmuebles").remove();
            // dibujo cabecera de la tabla
            $(".inmuebles").append("<table class='table' id='tablaInmuebles'>");
            $("#tablaInmuebles").append("<thead>" +
                "<th>Domicilio</th><th>Habitaciones</th><th>Precio</th>" +
                "</thead><tbody></tbody>");

            // si hay pisos
            if ($(pisos.datos).length != 0) {

                // dibujo el contenido de la tabla con los datos que se han devuelto y añado botón reservar que contiene el id del inmueble
                $(pisos.datos).each(function (ind, ele) {
                    $("#tablaInmuebles tbody").append("<tr><td>" + ele.domicilio + "</td><td>" + ele.habitaciones + "</td><td>" + ele.precio + "</td>"
                        + "<td><button class='boton btn btn-success btn-lg reservar' idpiso='" + ele.idinmuebles + "'>Reservar</button></td><tr>");
                });
                $(".reservar").on("click", reservaInmueble);


            }
            else {
                $("#tablaInmuebles tbody").append("<tr><td colspan='3'>No hay Inmuebles con esas características</td><tr>");
            }

        });
}

function reservaInmueble() {
    let idinmuebles = $(this).attr("idpiso"); // referencio al valor del atributo

    //fila = $(this).parents("tr");
    //fila.find("d:nth-child(2)").text() --> elemento 2 de la tabla, dentro de la fila que estemos

    $.ajax({
        url: "php/reservas.php",
        type: "POST",
        data: {
            dni: $("#dni").val(),
            inmueble: idinmuebles
        }
    })
        .done(function () {
            $("button[idpiso=" + idinmuebles + "]").attr("disabled", true);
            Swal.fire({ title: 'Aviso', text: 'Reservado', icon: 'ok', timer: 1000, buttons: false });
            //$("#tablaInmuebles").remove();
        })
        .fail(function () {
            Swal.fire("No se ha podido reservar", "", "success");
            /* Swal.fire("No se ha podido reservar", "", "success").then(result => {
                 //eliminar la fila de la tabla
                 $(fila).remove();
             });*/
        })
    tab
}

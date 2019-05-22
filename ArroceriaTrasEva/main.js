"use strict"

var xmlHttp, dialogo, domicilio = 0, precioPaella = 0, precioIngredientes = 0;


$(function () {
    cargarPaellas();
    validarPedido();
    configFormDialog();

    // al seleccionar una paella, carga los ingredientes
    $("#paellas").on("change", function () {
        // por si viene de otra paella inicializamos
        precioPaella = 0;
        precioIngredientes = 0;
        $(".liIngr li").remove();
        $('#ingredientes option:gt(0)').remove(); //elimina todos los elementos menos el primero

        // actualizo el valor de la paella
        precioPaella = parseInt($("#paellas option:selected").attr("precioPaella"));
        actualizaPrecio();
        cargarIngredientes();
    })


    //al pulsar sobre el domicilio cambiamos a 1 el domicilio para que lo sume
    $("#domicilio").on("change", function () {
        domicilio = 1; // y actualizo el valor del precio
        actualizaPrecio();
    })

    //al pulsar sobre el local cambiamos a 0 el domicilio para que lo reste si es que estaba antes seleccionado
    $("#local").on("change", function () {
        domicilio = 0; // y actualizo el valor del precio
        actualizaPrecio();
    })


    // al elegir ingrediente
    $("#ingredientes").on("change", function () {
        $(".liIngr").append("<li  precioIngrediente=" + $("#ingredientes option:selected").attr('precioIngrediente') + " value=" + $("#ingredientes option:selected").val() + ">" + $("#ingredientes option:selected").text() + "</li>")
        // añado el ingrediente y le sumo el precio, actualizandolo
        precioIngredientes = precioIngredientes + parseInt($("#ingredientes option:selected").attr("precioIngrediente"));
        //precioPaella=parseInt($("#paellas option:selected").attr("precioPaella"));
        actualizaPrecio();
        $("#ingredientes option:selected").remove();
    })

    // al hacer doble clik lo borramos de ahí, lo pasamos al input select y cambiamos el precio
    // XXX
    // ponerlo así para el doble click no se porqué no va

    $(document).on('dblclick', '.liIngr li', function () {
        $("#ingredientes").append("<option precioIngrediente=" + $(this).attr('precioIngrediente') + " value=" + $(this).val() + ">" + $(this).text() + "</option>")
        precioIngredientes = precioIngredientes - parseInt($(this).attr('precioIngrediente'));
        actualizaPrecio();
        $(this).remove(); // borro el elemento del liIngr
    });


    // patron para validar
    /*$.validator.addMethod("dni", function (valor, item, parametros) {

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

    // llamada dentro del validator
     dni: {
                required: true,
                dni: true
            },

    */
})

function cargarPaellas() {
    $.ajax({
        url: "php/paellas.php",
        type: "POST"
    })
        .done(function (datos) {
            $(datos.data).each(function (ind, ele) {
                $("#paellas").append("<option precioPaella=" + ele.precio + " value=" + ele.id + ">" + ele.descripcion + "</option>");
            })
        })
        .fail(function (err) {

        });
}


function cargarIngredientes() {
    xmlHttp = crearConexion();
    if (xmlHttp) {
        xmlHttp.open("POST", "php/ingredientes.php", true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = mostrarIngredientes;
        xmlHttp.send("paella=" + $("#paellas option:selected").val());
    }
}


function mostrarIngredientes() {

    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        let ingredientes = JSON.parse(xmlHttp.responseText);
        $.each(ingredientes.data, function (ind, ele) {
            $("#ingredientes").append("<option precioIngrediente=" + ele.precio + " value=" + ele.id + ">" + ele.descripcion + "</option>")
        })
    }
}



function validarPedido() {
    $(".form-pedido").validate({
        errorClass: "error",
        validClass: "success",
        errorElement: "em",
        rules: {
            paellas: "required",
            radios: "required",
            comensales: {
                required: true,
                min: 2,
                max: 20,
            },
        },
        messages: {
            paellas: "Es requerido",
            radios: "Es requerido",
            comensales: {
                required: "Es requerido",
                min: "Valor minimo 2",
                max: "Valor maximo 20",
            },
        },

        submitHandler: function (form) {
            comprobarDomicilio();
        }
    });
}


function configFormDialog() {
    //establecer la configuración de una ventana modal
    dialogo = $(".form-datos").dialog({
        modal: true,
        autoOpen: false,
        title: "Datos Personales",
        width: 400,
        resizable: false, //no se puede cambiar el tamaño
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        buttons: {
            "Aceptar": function () {
                grabarTicket();
            },
            "Borrar": function () {
                alert("Borra");
            },
        },
    });
}


function comprobarDomicilio() {
    // antes de grabar comprobamos si estaba seleccionado domicilio
    // si domicilio esta checkado
    if ($("#domicilio").prop('checked')) {
        dialogo.dialog("open"); //abrimos ventana modal de historial
    } else {
        grabarTicket();
    }
}

function grabarTicket() {

    $.ajax({
        url: "php/ticket.php",
        type: "POST",
        data: {
            // los datos no están bien pasados algunos fallan por eso no devuelve
            paella: $("#paellas option:selected").val(),
            ingredientes: $(".liIngr li").text(), // graba todo lo que hay en liIngr, el texto
            precio: $(".precio").val(),
            domicilio: $(".domicil").val(),
        }
    })
        .done(function (datos) {
            if ($(datos.mensaje) != "Error") {
                Swal.fire("Consulta guardada", "", "success").then(result => {
                    cerrarVentana();
                });
            } else {
                Swal.fire("Error", "No se ha podido guardar ", "error"); //error, warning, success
            }
        })
        .fail(function (err) {
            Swal.fire("Error", "Ha habido algún error", "error");
        });

}

function cerrarVentana() {
    dialogo.dialog("close");
    /* $("input").val(""); //limpiar las cajas de texto

 */

    //limpiar los check
    //$('.form-check-input')[0].checked = false;
    //$('.form-check-input')[1].checked = false;

    $(".form-pedido")[0].reset(); // reseteamos todo el formulario
    $('#paellas option:gt(0)').remove(); //elimina todos los elementos menos el primero
    $('#ingredientes option:gt(0)').remove(); //elimina todos los elementos menos el primero
    $(".liIngr li").remove();
    // reinicio valores
    domicilio = 0, precioPaella = 0, precioIngredientes = 0;
    cargarPaellas();
}

function actualizaPrecio() {
    $(".precio").prop('readonly', false);
    $(".precio").val(parseInt(precioPaella + precioIngredientes + domicilio));
}
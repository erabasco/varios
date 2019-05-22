// Tarea de la clínica
"use strict";
var xmlHttp;
let dialogo, dialogHistorial, fila, accion;

$(function () {
    cargarVeterinarios();
    cargarClientes();
    cargarTratamientos();

    // configuración del formulario modal
    configFormModal(); 

    // EVENTOS :::::::::::
    // comprobamos cuando cambia cliente para cargar las mascotas
    $(document).on('change', '#cli', function (event) {
        $("#can option:gt(0)").remove(); //borro posibles mascotas de otro cliente
        //: el selector gt() selecciona elementos con un índice más alto del especificado

        // si está seleccionado un cliente cargamos las mascotas
        if ($("#cli option:selected").text() != "Seleccione un cliente") {
            cargarMascotas($(this).val()); // recogo el valor de la opción seleccionada
        }
    });
    //si pulsamos sobre el botón añadir, debemos tener un cliente seleccionado
    $(document).on('click', '#addCan', function (event) {
        if ($("#cli option:selected").text() == "Seleccione un cliente") {
            Swal.fire("ERROR", "Debes seleccionar un Cliente!!", "error"); //error, warning, success
        } else {
            // si está el cliente seleccionado, establecemos unos valores para el modal
            accion = "add";
            dialogo.dialog("option", "title", "Añadir Perro");
            dialogo.dialog("open"); //abrir ventana
        }
    });

    //si pulsamos sobre el botón historial, debemos tener una mascota seleccionada
    $(document).on('click', '#verHis', function (event) {
        if ($("#can option:selected").text() == "Seleccione una mascota") {
            Swal.fire("AJAX", "Debes seleccionar una mascota!!", "error"); //error, warning, success
        } else {
            // antes de mostrar el modal lo configuramos y recogemos el valor del perro, he probado a
            // incluir la configuración arriba y parece que se solapa con el otro modal
            configFormModalHistorial();
            mostrarHistorial($("#can option:selected").val());
            dialogHistorial.dialog( "open"); //abrimos ventana modal de historial
        }
    });
    // si hacemos doble click en tratamientos generales lo pasamos a tratamientos en consulta  
    $(document).on('dblclick', '#tratamientos li', function (event) {
        //$(this).remove(); // en vez de borrar lo voy a ocultar
        $(this).hide();  // lo oculto de aquí y lo añado como tratamiento
        $('.consulta').append("<li value=" + $(this).val() + ">" + $(this).text() + "</li>");
        $(this).append();
    });

    // si hacemos doble click en tratamientos en consulta  se pasan a tratamientos generales
    $(document).on('dblclick', '.consulta li', function (event) {
        //$(this).remove(); // lo borro de aquí y lo añado como tratamiento
        $(this).hide();     // lo oculto de aquí y lo añado como tratamiento
        $('#tratamientos').append("<li value=" + $(this).val() + ">" + $(this).text() + "</li>");
        $(this).append();
    });

    // botón guardar consulta
    $(document).on('click', '.btn-primary', function (event) {
        // configuro la validación y desde ese metodo llamo a grabarConsulta();
        configFormValdConsulta();
    });


    // botón guardar perro
    $(document).on('click', '.btn-primary', function (event) {
        // configuro la validación y desde ese metodo llamo a grabarPerro();
        configFormValdPerro();
    });
});


function cargarVeterinarios() {
    //conexion AJAX mediante jquery
    $.ajax({
        url: "php/veterinarios.php",
    })
        .done(function (result) {
            console.log(result);
            // result datos es el nombre del array
            $(result.datos).each(function (ind, ele) {
                $('#vet').append("<option value=" + ele.dni + ">" + ele.nomApe + "</option>");
            })
        })
}

function cargarClientes() {
    $.ajax({
        url: "php/clientes.php",
    })
        .done(function (result) {
            console.log(result);
            $(result.datos).each(function (ind, ele) {
                $('#cli').append("<option value=" + ele.dni + ">" + ele.nomApe + "</option>");

            })
        })
        .fail(function () {
            //error
            Swal.fire("Error en la carga de Clientes", "Ha habido algún fallo", "error"); //error, warning, success
        })
}

function cargarTratamientos() {
    $.ajax({
        url: "php/tratamientos.php",
    })
        .done(function (result) {
            console.log(result);
            $(".tratamientos").append("<ul id='tratamientos'>");
            $(result.datos).each(function (ind, ele) {
                // añado value para poder pasar luego el valor del id
                $('#tratamientos').append("<li value=" + ele.id + ">" + ele.descripcion + "</li>");
            })
        })
        .fail(function () {
            //error
            Swal.fire("Error en la carga de Tratamientos", "Ha habido algún fallo", "error"); //error, warning, success
        })
}

function cargarMascotas(cliente) {
    xmlHttp = crearConexion();
    if (xmlHttp) {
        //establecer el evento al botón
        xmlHttp.open("POST", "php/perros.php", true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //preparar el evento.
        xmlHttp.onreadystatechange = mostrarMascotas;
        xmlHttp.send("cliente=" + cliente); //comienza la conexión
    } else {
        alert("El navegador no soporta AJAX");
    }
}

function mostrarMascotas() {

    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        let mascotas = JSON.parse(xmlHttp.responseText); // devuelve un JSON
        console.log(mascotas)
        $(mascotas.datos).each(function (ind, ele) { //datos es el nombre del array que devuelve
            $('#can').append("<option value=" + ele.chip + ">" + ele.nombre + "</option>");
        })
    }
}

function mostrarHistorial(id) {
    $.ajax({
        url: "php/historial.php",
        type: 'POST',
        data: {
            chip: id
        },

    })
        .done(function (result) {
            // antes de mostrar borro si había algo anterior en el historial
            $("#tablaHistorial").remove();
            $(".historial").append("<table id='tablaHistorial'>");
            $("#tablaHistorial").append("<thead>" +
                "<tr>" +
                "<th width='110px'>Fecha</th>" +
                "<th width='100px'>Hora</th>" +
                "<th>Observaciones</th>" +
                "</tr>" +
                "</thead><tbody>");

            $(result.datos).each(function (ind, ele) {
                $("#tablaHistorial tbody").append("<tr><td>" +
                    ele.fecha + "</td><td>" + ele.hora + "</td><td>" + ele.observaciones + "</td><tr>")
            })

        })
        .fail(function () {
            //error
            Swal.fire("Error en la carga", "Ha habido algún fallo", "error"); //error, warning, success
        })
}

function grabarConsulta() {
   
    $.ajax({
        url: "php/saveConsulta.php",
        type: 'POST',
        data: {
            fec: $("#fechaC").val(),
            hora: $("#horaC").val(),
            observaciones: $(".consulta li").text(),
            vet: $("#vet  option:selected").val(),
            chip: $("#can option:selected").val() // chip     
        },

    })
        .done(function (resultado) {
            console.log(resultado);
            if ($(resultado.mensaje)[0] != "Error") {
                $(resultado.datos).each(function (ind, ele) {
                    $('#cli').append("<option value=" + ele.dni + ">" + ele.nomApe + "</option>");
                })
                Swal.fire("Consulta guardada", "", "success").then(result => {
                    cerrarVentana();
                });
            } else {
                Swal.fire("Error", "No se ha podido guardar ", "error"); //error, warning, success
            }
        })
}

function grabarPerro() {
   
    $.ajax({
        url: "php/saveCan.php",
        type: 'POST',
        data: {
            chip: $("#chip").val(), // chip     
            nombre: $("#nomPer").val(),
            fechaN: $("#fechaN").val(),
            raza: $("#raza").val(),
            cli: $("#cli option:selected").val(),
        },
    })
        .done(function (resultado) {
            console.log(resultado);
            if ($(resultado.mensaje) != "Error") {
                Swal.fire("Registro de perro insertado", "ok", "success").then(result => {
                    // insertamos el perro en el combo, aunque como vamos a limpiar no se verá ninguno hasta 
                    // que seleccionemos de nuevo el cliente/dueño
                    $("#can").append("<option value=" + $("#nomPer").val() + ">" + $("#nomPer").val() + "</option>");
                    cerrarVentana();
                });
            } else {
                Swal.fire("Registro no insertado", "Error", "error");
            }
        })
        .fail(function () {
            //error
            Swal.fire("Error", "No se ha podido guardar ", "error"); //error, warning, success

        })
}

function configFormModal() {
    dialogo = $("#perro").dialog({
        autoOpen: false,
        // height: 400,
        width: 700,
        modal: true,
        title: "Añadir perros",
        resizable: false, //no permite modificar tamaño ventana
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });
}

function configFormModalHistorial() {
    dialogHistorial = $(".historial").dialog({
        autoOpen: false,
        // height: 400,
        width: 1000,
        modal: true,
        title: "Historial de " + $("#can option:selected").text(), 
        resizable: false, //no permite modificar tamaño ventana
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        //si pulsamos en cerrar
        close: function () {
            // cerramos el modal
            dialogo.dialog("close");
        }
    });
}


function configFormValdPerro() {
    $(".frmAddPerro").validate({
        rules: {
            chip: {
                required: true,
                minlength: 4,
                maxlength: 14
            },
            nomPer: "required",
            raza: {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            fechaN: {
                required: true,
                date: true
            }
        },
        messages: {
            nomPer: "El nombre del perro es requerido",
            chip: {
                required: "El chip del  perro es requerido",
                minlength: "El mínimo de carácteres debe ser 4",
                maxlength: "El máximo de carácteres debe ser 20"
            },
            fechaN: "La fecha es requerida",
            raza: {
                required: "La raza del perro es requerido",
                minlength: "El mínimo de carácteres debe ser 3",
                maxlength: "El máximo de carácteres debe ser 20"
            }
        },
        submitHandler: function (form) {
            if (accion == "add") {
                grabarPerro();
            }
        }
    });
}

function configFormValdConsulta() {
    $(".form-horizontal").validate({
        rules: {
            vet: {
                required: true,
            },
            nomPer: "required",
            cli: {
                required: true,
            },
            can: {
                required: true,
            },
            fechaC: { required: true },
            horaC: { required: true },

        },
        messages: {
            vet: "Veterinario requerido",
            nomPer: "Seleccione el perro a consultar",
            cli: "Indique el cliente",
            can: "Indique el perro",
            fechaC: "Fecha requerida",
            horaC: "Hora requerida"
        }, 
        submitHandler: function (form) {
            grabarConsulta();
        }
    });
}


function cerrarVentana() {
    // al cerrar la ventana voy a reiniciar todos los elementos
    dialogo.dialog("close");
    $("input").val(""); //limpiar las cajas de texto
    $("#vet").val("");
    $("#cli").val(""); 
    $("#fechaC").val("");
    $('#can option:gt(0)').remove(); //elimina todos los elementos menos el primero

    // borro los valores del lado de la consulta y muestro con show los tratamientos, por si faltaba alguno
    $("#tratamientos li").show();
    $(".consulta li").remove();

}

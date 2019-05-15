"use strict";
let dialogo, fila, accion;
let buttonAcc =
    "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button><button type='button' class='eliminar btn btn-danger'><i class='fas fa-trash-alt'></i></button>";
$(function () {
    configFormModal();
    configFormVald();
    cargarReg();
    //funcionalidad al botón añadir
    $("#add").on("click", addReg);
    $("#cancelar").on("click", cerrarVentana);
});

function cargarReg() {
    $.ajax({
            url: "php/mostrarPaginador.php",
            type: "GET"
        })
        .done(function (datos) {
            $(datos.data).each(function (ind, ele) {
                $(".table tbody").append(
                    `<tr><td>${ele.chip}</td><td>${ele.nombre}</td><td>${
            ele.raza
          }</td><td>${ele.fechaNac}</td><td>${buttonAcc}</td></tr>`
                );
            });
            if ($("tbody tr").length == 0) {
                //no hay registros
                $(".table tbody").append(
                    `<tr><td colspan=4 class='text-center'>No hay registros</td></tr>`
                );
            } else {
                $(".editar").on("click", editReg);
                $(".eliminar").on("click", deleteReg);
            }
        })
        .fail(function () {
            Swal.fire("Fallo en la carga de mascotas", "Error CRUD", "error");
        });
}

function addReg() {
    //abrir ventana
    accion = "add";
    dialogo.dialog("option", "title", "Añadir Perro");
    $(".boton").text("Añadir");

    dialogo.dialog("open"); //abrir ventana
}

function editReg() {
    fila = $(this).parents("tr");
    accion = "edit";
    //abrir el formulario
    dialogo.dialog("option", "title", "Modificar Perro");
    $(".boton").text("Modificar");
    //bucle para recorrer los td
    $(fila)
        .find("td")
        .each(function (ind, ele) {
            switch (ind) {
                case 0:
                    $("#chip").val($(ele).text());
                    break;
                case 1:
                    $("#nombre").val($(ele).text());
                    break;
                case 2:
                    $("#raza").val($(ele).text());
                    break;
                case 3:
                    $("#fechaN").val($(ele).text());
                    break;
            }
        });
    dialogo.dialog("open");
}

function deleteReg() {
    fila = $(this).parents("tr");
    Swal.fire({
        title: "¿Desea eliminar el registro",
        text: "Chip borrado: " + fila.find("td:first").text(),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Cancelar",
        cancelButtonText: "Eliminar"
    }).then(result => {
        if (!result.value) {
            $.ajax({
                url: "php/eliminar.php",
                type: "POST",
                data: {
                    chip: fila.find("td:first").text()
                }
            }).done(function (datos) {
                if ($(datos.mensaje)[0] != "Error") {
                    Swal.fire("Registro Eliminado", "", "success").then(result => {
                        //eliminar la fila de la tabla
                        $(fila).remove();
                    });
                }
            });
        }
    });
}

function configFormModal() {
    dialogo = $(".container-fluid").dialog({
        autoOpen: false,
        // height: 400,
        width: 600,
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

function configFormVald() {
    $(".form-horizontal").validate({
        rules: {
            chip: {
                required: true,
                minlength: 4,
                maxlength: 14
            },
            nombre: "required",
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
            chip: "El chip del perro es requerido",
            raza: {
                required: "La raza del perro es requerido",
                minlength: "El mínimo de carácteres debe ser 3",
                maxlength: "El máximo de carácteres debe ser 20"
            }
        },
        submitHandler: function (form) {
            if (accion == "add") {
                grabarReg();
            } else {
                modificarReg();
            }
        }
    });
}

function grabarReg() {
    let datos = $(".form-horizontal").serialize(); //
    $.ajax({
        url: "php/insertar.php",
        type: "POST",
        data: datos
    }).done(function (datos) {
        if ($(datos.mensaje)[0] != "Error") {
            Swal.fire("Registro insertado", "ok", "success").then(result => {
                //insertar el registro en la tabla
                $(".table tbody").append(
                    `<tr><td>${$("#chip").val()}</td><td>${$(
            "#nombre"
          ).val()}</td><td>${$("#raza").val()}</td><td>${$(
            "#fechaN"
          ).val()}</td><td>${buttonAcc}</td></tr>`
                );
                $(".editar").on("click", editReg);
                $(".eliminar").on("click", deleteReg);
                cerrarVentana();
            });
        } else {
            Swal.fire("Registro no insertado", "Error", "error");
        }
    });
}

function modificarReg() {
    let datos = $(".form-horizontal").serialize(); //
    $.ajax({
        url: "php/editar.php",
        type: "POST",
        data: datos
    }).done(function (datos) {
        if ($(datos.mensaje)[0] != "Error") {
            Swal.fire("Registro modificado", "ok", "success").then((result) => {
                //actualizar fila de la tabla
                $(fila).find("td:nth-child(1)").text($("#chip").val());
                $(fila).find("td:nth-child(2)").text($("#nombre").val());
                $(fila).find("td:nth-child(3)").text($("#raza").val());
                $(fila).find("td:nth-child(4)").text($("#fechaN").val());
                cerrarVentana();
            })
        }else{
            Swal.fire("Registro no modificado", "Error", "error");
        }
    })
}

function cerrarVentana() {
    dialogo.dialog("close");
    $("input").val(""); //limpiar las cajas de texto
}
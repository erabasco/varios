let xmlHttp, dialogo;
$(function () {
  xmlHttp = crearConexion(); //creamos objeto xmlHttp
  if (xmlHttp) {
    configFormDialog() //configurar ventana modal
    validarPedido(); //configurar la validación con la libreria jquery-validation
    cargarPaellas(); //cargar las paellas
    //cuando se produzca algún cambio en los radio, así como en los comensales
    //actualizar precio
    $(".form-check-input").on("change", function () {
      calcularPrecio();
    })
    $(".comensales").on("change", function () {
      calcularPrecio();
    })
  } else {
    Swal.fire("El navegador no soporta el objeto xml", "", "error");
  }
});

function cargarPaellas() {
  $.ajax({
    url: "php/paellas.php"
  })
    .done(function (datos) {
      $(datos.data).each(function (ind, value) {
        $("#paellas").append(
          //cargar en la opción el id de la paella y el atributo precio
          "<option value=" + value.id + " precio=" + value.precio + ">" + value.descripcion + "</option>"
        );
      });
      //Cuando se produce un cambio en la paella se cargarán los ingredientes extras
      $("#paellas").on("change", function () {
        //eliminar la lista;
        $("ul").remove();
        calcularPrecio(); //actualizar precio
        cargarIngredientes($(this).val());//se pasará el atributo value
      })
    })
    .fail(function (err) {
      swal("Error al cargar las paellas", "", "error");
    });
}


function cargarIngredientes(idPaella) {
  if ($("#paellas option:selected").index() != 0) {
    xmlHttp.open("POST", "php/ingredientes.php", true);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        let datos = JSON.parse(xmlHttp.responseText);

        $("#ingredientes option:gt(0)").remove(); //elimina todas las opciones, excepto la primera
        $(datos.data).each(function (ind, value) {
          //se guardará en el atributo value el precio para calcular el importe
          $("#ingredientes").append(
            "<option value=" + value.precio + ">" + value.descripcion + "</option>"
          );
        });
        //crear lista de ingredientes
        $(".liIngr").append("<ul></ul>")
        $("#ingredientes").on("change", elegirIng);
      };
    }
    xmlHttp.send("paella=" + idPaella);
  } else {
    $("#ingredientes option:first").attr("selected", true);
  }
}
function elegirIng() {
//añadir el ingrediente a la lista
  $(".liIngr ul").append("<li precio=" + $("#ingredientes option:selected").val() + ">" + $("#ingredientes option:selected").text() + "</li>");
  $("#ingredientes option:selected").remove(); //eliminar la opción.
  calcularPrecio();
  //establecer la operación contraria. Quitar de la lista al select
  $(".liIngr li:last").on("click", function () {
    $("#ingredientes").append("<option value=" + $(this).attr("precio") + ">" + $(this).text() + "</option>");
    $(this).remove();
    calcularPrecio();
  })
}

function limpiar() {
  //limpiar los check
  $('.form-check-input')[0].checked = false;
  $('.form-check-input')[1].checked = false;
  //seleccionar la primera opción
  $('#paellas option:eq(0)').attr("selected", true);
  $("#ingredientes option:gt(0)").remove()//todas menos la primera
  $(".liIngr li").remove(); //eliminar todas los elementos
  $("#ingredientes").off("change");//quitar eventos
  $(".comensales, .precio").val(""); //vaciar los text, todos en uno
 
}
function calcularPrecio() {
  let precio = 0;

  
  if ($("#paellas option:selected").index() != 0) {
    precio += parseInt($("#paellas option:selected").attr("precio"));
  }
  $(".liIngr li").each(function (ind, ele) {
    precio += parseInt($(ele).attr("precio"));
  })
  if ($(".comensales").val() != "") {
     precio-=parseInt($("#paellas option:selected").attr("precio"));
     precio = (parseInt($("#paellas option:selected").attr("precio"))+precio) * parseInt($(".comensales").val());
  }
  if ($(":radio[name=radios]:checked").val() == "domicilio") {
    precio += 1;
  }
  $(".precio").val(precio);
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

        grabar();
      }
    },
  });
}

function grabar() {
  let ingredientes = "";
  //cargar los ingredientes en una variable texto
  $(".liIngr li").each(function (ind, ele) {
    ingredientes += $(ele).text() + ", ";
  })
  $.ajax({
    url: "php/ticket.php",
    type: "POST",
    data: {
      paella: $("#paellas").val(),
      ingredientes: ingredientes,
      precio: $(".precio").val(),
      domicilio: $(".domicil").val()
    }
  })
    .done(function () {
      Swal.fire("ticket guardado", "", "success").then(result => {
        //limpiar las cajas de texto
        dialogo.dialog("close");
        limpiar();


      });
    })
    .fail(function () {
      Swal.fire("Error al grabar el ticket", "", "error").then(result => {
        dialogo.dialog("close")
      });

    });
}
function validarPedido() {
  $(".form-pedido").validate({
    errorClass: "error",
    validClass: "success",
    errorElement: "em",
    rules: {
      radios: "required",
      paellas: "required",
      comensales: {
        required: true,
        min: 2,
        max: 20
      }
    },
    //esta parte no es necesaria pero mejora la visualización de
    //mensajes de error.
    errorPlacement: function (error, element) {
      if (element.attr("name") == "radios") {
        error.appendTo(".errorRadio");

      } else if (element.attr("name") == "paellas") {
        error.appendTo(".errorPaella");

      } else {
        error.appendTo(".errorComensales");
      }
    },
    submitHandler: function (form) {
      //si se ha pulsado el radio domicilio se abrirá la ventana modal
      if ($(":radio[name=radios]:checked").val() == "domicilio") {
        dialogo.dialog("open");
      } else {

        grabar();

      }
    }
  });
}

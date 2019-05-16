/* 
Era una página para gestionar viajes en bus, había que cargar los itinerarios por xmlhttp, 
una vez cargados si el itinerario es de más de 800km se necesitan dos conductores, 
cuando se elija el primero, el segundo obviamente no puede ser el mismo que el primero, 
y por ultimo se elige con que marca de bus se hace el viaje, todos los campos son requeridos y 
se válida con validate, y cuando todo esté correcto y se guarde el viaje en la base de datos se 
muestra un mensaje con dialog
 */
$(function(){
    validar();
    ventanaDlg();
    cargarItinerario();
    $("button").eq(1).on("click",function(){
        alert("se pulsa");
        // se reinician los select y valor de la fecha ha pulsado cancelar
        $("select").val("")
        $("#fecha").val("dd/mm/aaaa")
    })
    $("#itinerario").on("change",Valconductor2)
    $("#conductor1").on("change",mostrarConductor2)
    cargarConductor1();
    cargarVehiculos();
})

function cargarItinerario(){
    $.ajax({
        url: "php/Itinerarios.php",
        type: "POST",
        dataType: "json",
        data: ""
    })
    
    .done(function (datos) {
    
        //$(datos.itinerarios).each(function (ind, ele) {
       $.each(datos.itinerarios, function (ind, ele) {
            $("#itinerario").append("<option value="+ele.idItin+" id="+ele.km+">"+ele.descripcion+"</option")
        })
    })
    .fail(function () {
      
    })
}

function cargarConductor1(){
    $.ajax({
        url: "php/Conductores.php",
        type: "POST",
        dataType: "json"
    })
    .done(function (datos) {
        $.each(datos.conductores, function (ind, ele) {
            $("#conductor1").append("<option id=c1"+ele.idConductor+" value="+ele.idConductor+">"+ele.apellidosNombre+"</option")
        })
    })
    .fail(function () {
      
    })
}

function cargarConductor2() {
    xmlHttp=crearConexion();
    xmlHttp.open("GET", "php/Conductores.php")
    xmlHttp.onreadystatechange = function () {

        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) { //Si todo es correcto
            var datos = JSON.parse(xmlHttp.responseText); //parsear a JSON ya que viene en texto
            $.each(datos.conductores,function (ind, ele) {  
                if(ele.idConductor!=$("#conductor1 option:selected").val()){
                    $("#conductor2").append("<option id=c2"+ele.idConductor+" value="+ele.idConductor+">"+ele.apellidosNombre+"</option")
                }          
                
            })
        }
    }
    xmlHttp.send();
}

function cargarVehiculos() {
    xmlHttp=crearConexion();
    xmlHttp.open("GET", "php/Vehiculos.php")
    xmlHttp.onreadystatechange = function () {

        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) { //Si todo es correcto
            var datos = JSON.parse(xmlHttp.responseText); //parsear a JSON ya que viene en texto
            $.each(datos.vehiculos,function (ind, ele) {            
                $("#vehiculo").append("<option value="+ele.idMatricula+">"+ele.descripcion+"</option")
            })
        }
    }
    xmlHttp.send();
}

function mostrarConductor2(){
    if($("#conductor1").val()!=""){
        $("#conductor2").empty()
        $("#conductor2").append("<option value='' selected>Seleccione...</option>")
        cargarConductor2()
    }    
}

function Valconductor2(){
    if($("#itinerario option:selected").attr("id")>800){
        $("#conductor2").prop("disabled",false)
        $("#conductor2").empty()
        $("#conductor2").append("<option value='' selected>Seleccione...</option>")
        
    }else{
        $("#conductor2").prop("disabled",true)
    }
}

function grabar(){
    if($("#conductor2").val()==""){
        insert($("#conductor1").val())
    }else{        
        insert($("#conductor1").val())
        insert($("#conductor2").val())
    }
    
}

function insert(dato){
    $.ajax({
        url: "php/Viajes.php",
        type: "POST",
        data: {
            idIti : $("#itinerario").val(),
            fecha : $("#fecha").val(),
            idConductor : dato,
            idMatricula : $("#vehiculo").val()
        }
    })
    .done(function (datos) {
        $("#dlg").html("Datos Guardados correctamente")
        $("#dlg").dialog("open")
        
    })
    .fail(function (data, status, error) {
        $("#dlg").html("Ha fallado la comunicacion con el servidor" + error)
        $("#dlg").dialog("open")        
    })
}

function validar() {
    $("#frm").validate({
        errorContainer: "#errores",
        errorLabelContainer: "#errores ul",
        wrapper: "li",
        errorElement: "em",
        rules: {
            itinerario: "required",
            fecha: "required",
            conductor1: "required",
            conductor2: "required",
            vehiculo : "required"           
        },
        submitHandler: function (form) {
            grabar();
            $("select").val("")
            $("#fecha").val("dd/mm/aaaa")
        }
    })
}


function ventanaDlg() {
    $("#dlg").dialog({
        autoOpen: false,
        modal: true,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        buttons: {
            Aceptar: function () {
                $(this).dialog("close");
            }
        }
    });
}


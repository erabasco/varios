<?php
require_once "connection.php";



$idItinerario = $_REQUEST['idIti'];
$fecha = $_REQUEST['fecha'];
$idConductor = $_REQUEST['idConductor'];
$idMatricula = $_REQUEST['idMatricula'];

$insertar = "INSERT INTO viajes VALUES(NULL,$idItinerario,'$fecha',$idConductor,'$idMatricula')";


$connection->query($insertar);

$connection->close();
?>

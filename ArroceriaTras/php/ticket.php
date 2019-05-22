<?php

require_once "connection.php";

$paella = $_POST['paella'];
$ingredientes = $_POST['ingredientes'];
$precio = $_POST['precio'];
$domicilio=$_POST['domicilio'];


$jsondata = array();

$sql = "INSERT INTO ticket VALUES(NULL,'$paella','$ingredientes','$precio',CURDATE(),'$domicilio')";

$respuesta=$connection->query($sql);
 if(!$respuesta){
    $jsondata["mensaje"]="Error";
 };
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();
exit();




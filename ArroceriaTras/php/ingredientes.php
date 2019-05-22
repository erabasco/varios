<?php

require_once "connection.php";


$paella = $_POST['paella'];



$jsondata = array();

$sql="SELECT * FROM `ingredientes` WHERE idpaella=$paella";
if ($result = $connection->query($sql)) {
   
    while ($row = $result->fetch_object()) {
        $jsondata["data"][] = $row;
    }
}
$result->close();
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();

exit();

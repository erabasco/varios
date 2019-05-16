<?php
require_once "connection.php";

$jsondata = array();

if ($result = $connection->query("SELECT * FROM conductores order by apellidosNombre")) {
    $jsondata["conductores"] = array();
    while ($row = $result->fetch_object()) {
        $jsondata["conductores"][] = $row;
    }
}
$result->close();
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata, JSON_FORCE_OBJECT);

$connection->close();

exit();
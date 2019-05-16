<?php
require_once "connection.php";

$jsondata = array();

if ($result = $connection->query("SELECT * FROM itinerarios order by descripcion")) {
    $jsondata["itinerarios"] = array();
    while ($row = $result->fetch_object()) {
        $jsondata["itinerarios"][] = $row;
    }
}
$result->close();
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata, JSON_FORCE_OBJECT);

$connection->close();

exit();
<?php
require_once "connection.php";

$jsondata = array();

if ($result = $connection->query("SELECT * FROM vehiculos")) {
    $jsondata["vehiculos"] = array();
    while ($row = $result->fetch_object()) {
        $jsondata["vehiculos"][] = $row;
    }
}
$result->close();
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata, JSON_FORCE_OBJECT);

$connection->close();

exit();
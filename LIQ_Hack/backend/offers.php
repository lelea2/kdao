<?php
header('Content-Type: application/json');
$storename = isset($_GET['storename']) ? $_GET['storename'] : '';
$file = file_get_contents('offers_' . $storename . '.json');
$data = json_decode($file);
echo "define(" . json_encode($data) . ");";
?>
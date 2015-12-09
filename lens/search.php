<?php
$query = $_GET["q"];
if (empty($query)) {
    $template = file_get_contents('assets/templates/page.html');
    echo $template;
    return;
}
$template = file_get_contents('assets/templates/search.html');
echo $template;
?>

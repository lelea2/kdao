<?php
    $size = !empty($_GET['size']) ? $_GET['size'] : '680,500';
    $arr = explode(',', $size);
    $title = $_GET['t'];
    $searchEnabled = isset($_GET['s']) ? $_GET['s'] : 'no';
    $listitem = !empty($_GET['i']) ? $_GET['i'] : '';
    $style = $_GET['c'];
    $color = $_GET['color'];
    $textcolor = $_GET['tc'];
    $source = $_GET['source'];
?>
<!DOCTYPE>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>uList | Coupons.com</title>
    <link rel="icon" href="//cdn.cpnscdn.com/www.coupons.com/favicon.ico">
    <link rel="stylesheet" href="frontend/css/lib/bootstrap.css">
    <link rel="stylesheet" href="frontend/css/template.css">
    <style>
        .widget h1,
        .list button {
            background: <?php echo $color; ?>;
            color: <?php echo $textcolor ?>;
        }
        .widget {
            border: 1px solid <?php echo $color; ?>;
        }
        ul {
            list-style: none;
        }
    </style>
</head>
<body>
    <div class="widget <?php echo "pods_".$style; ?> search-<?php echo $searchEnabled; ?> <?php echo $source;?>" style="width:<?php echo $arr[0];?>px; height:<?php echo $arr[1];?>px;">
        <h1><?php echo $title;?></h1>
        <!-- Template rendering from here -->
        <?php
        $template = file_get_contents('frontend/templates/template_' . $arr[0] . 'x' . $arr[1] . '.html');
        echo $template;
        ?>
    </div>
</body>
</html>
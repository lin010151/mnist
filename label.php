<?php
$base_dir = "/var/www/html/mnist/";
$old = $base_dir . "samples/" . $_POST['old'];
if($_POST['state'] === "true") {
	$new = $base_dir . "samples/correct/" . $_POST['new'];
} else {
	$new = $base_dir . "samples/wrong/" . $_POST['new'];
}
echo json_encode(rename($old, $new));
?>
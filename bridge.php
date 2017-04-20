<?php
// 接收 base64 jpg
$source = base64_decode(preg_replace("#^data:image/\w+;base64,#i", "", $_POST["base64"]));

// 保存 jpg
$base_dir = "/var/www/html/mnist/";
$func_dir = $base_dir . "functions/";
$sample_dir = $base_dir . "samples/";
$sample_name = "unknown_" . time() . ".jpg";
file_put_contents($sample_dir . $sample_name, $source);

// 转换图片颜色通道
$convert_cmd = $func_dir . "convert.py --image " . $sample_dir . $sample_name;
shell_exec(escapeshellcmd($convert_cmd));

// 预测图片并输出结果
$predict_cmd = $func_dir . "predict.py --image " . $sample_dir . $sample_name . " --model " . $func_dir . "model.h5";
$output = shell_exec(escapeshellcmd($predict_cmd));
echo json_encode($sample_name . ";" . $output);
?>
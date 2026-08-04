<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>System Check & Auto-Fixer v2</h1>";
echo "<b>Current PHP Version:</b> " . phpversion() . "<br><br>";

$logs = [
    'Main Error Log' => dirname(__DIR__) . '/error_log',
    'Public Error Log' => __DIR__ . '/error_log',
    'Laravel Log' => dirname(__DIR__) . '/storage/logs/laravel.log'
];

foreach ($logs as $title => $path) {
    echo "<h2>$title</h2>";
    if (file_exists($path)) {
        $lines = file($path);
        if (count($lines) > 0) {
            $last = array_slice($lines, -20);
            echo "<pre style='background:#f4f4f4; padding:10px; border:1px solid #ddd; overflow:auto;'>";
            echo htmlspecialchars(implode("", $last));
            echo "</pre>";
        } else {
            echo "<i>Log is empty.</i><br>";
        }
    } else {
        echo "<i>Log file does not exist.</i><br>";
    }
}
?>

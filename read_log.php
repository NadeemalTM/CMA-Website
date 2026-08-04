<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$logFile = dirname(__DIR__) . '/storage/logs/laravel.log';

if (!file_exists($logFile)) {
    echo "<h1>Log file does not exist!</h1>";
    echo "Path checked: $logFile";
    exit;
}

echo "<h1>Latest Laravel Errors</h1>";
echo "<pre style='background:#111; color:#0f0; padding:20px; overflow:auto; max-height:80vh;'>";

// Read the last 20000 bytes of the file to get the most recent errors efficiently
$filesize = filesize($logFile);
$fp = fopen($logFile, 'r');
if ($filesize > 20000) {
    fseek($fp, -20000, SEEK_END);
}
$content = fread($fp, 20000);
fclose($fp);

// Filter to only show actual Stack traces and error messages, avoiding info logs if possible
$lines = explode("\n", $content);
$filtered = array_slice($lines, -100); // just get the last 100 lines for readability

echo htmlspecialchars(implode("\n", $filtered));
echo "</pre>";

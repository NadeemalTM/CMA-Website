<?php
// Turn on all PHP errors so they print to the screen instead of failing silently
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Laravel Boot Sequence Debugger</h1>";
echo "PHP Version: " . phpversion() . "<br><hr>";

try {
    // Attempt to manually boot Laravel
    require __DIR__ . '/index.php';
} catch (\Throwable $e) {
    // If Laravel crashes, catch the crash and print it!
    echo "<h2 style='color:red;'>CRITICAL LARAVEL CRASH:</h2>";
    echo "<pre style='background:#f4f4f4; padding:15px; border:1px solid #ccc; font-size:14px;'>";
    echo (string) $e;
    echo "</pre>";
}
?>

<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Ultimate Storage Linker</h1>";

// Backend root is one level up from /public
$backend_root = dirname(__DIR__); 

$target = $backend_root . '/storage/app/public';
$link = __DIR__ . '/storage';

echo "Target: $target<br>";
echo "Link: $link<br><br>";

if (file_exists($link)) {
    echo "Symlink or folder already exists. Attempting to remove it...<br>";
    if (is_link($link)) {
        if (unlink($link)) {
            echo "Old symlink removed.<br>";
        } else {
            echo "Failed to remove old symlink!<br>";
            exit;
        }
    } else {
        echo "<b>ERROR:</b> It's a real directory, not a symlink! Cannot safely remove. Please delete /public/storage manually.<br>";
        exit;
    }
}

if (symlink($target, $link)) {
    echo "<h2 style='color: green;'>SUCCESS! Storage symlink created!</h2>";
    echo "Your images should now load perfectly!<br>";
} else {
    echo "<h2 style='color: red;'>FAILED to create symlink!</h2>";
    echo "symlink() might be disabled on this server.<br>";
    
    // Try artisan fallback
    echo "Attempting Artisan fallback...<br>";
    try {
        require $backend_root.'/vendor/autoload.php';
        $app = require_once $backend_root.'/bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
        $status = $kernel->call('storage:link');
        echo "<h2 style='color: green;'>SUCCESS! Storage symlink created via Artisan!</h2>";
    } catch (Exception $e) {
        echo "Artisan fallback failed: " . $e->getMessage() . "<br>";
    }
}

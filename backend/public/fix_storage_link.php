<?php
/**
 * Fix Storage Link for cPanel Deployments
 * Run this file from the browser: http://api.new.condominium.lk/fix_storage_link.php
 */

$target = __DIR__ . '/../storage/app/public';
$link = __DIR__ . '/storage';

echo "<h2>Storage Link Fixer</h2>";

if (file_exists($link)) {
    echo "Found existing 'storage' folder or link in public directory.<br>";
    if (is_link($link)) {
        unlink($link);
        echo "Removed old symlink.<br>";
    } elseif (is_dir($link)) {
        // If it's a real directory, we must delete its contents first or just warn
        echo "<b>Warning:</b> 'public/storage' is a real directory, not a link. Attempting to remove it...<br>";
        @rmdir($link); // Will only work if empty. 
    }
}

if (symlink($target, $link)) {
    echo "<h3 style='color:green;'>SUCCESS: Storage symlink created!</h3>";
    echo "<p>Your images and PDFs should now load correctly.</p>";
    echo "<p>Please delete this file (fix_storage_link.php) from your server for security.</p>";
} else {
    echo "<h3 style='color:red;'>FAILED: Could not create symlink.</h3>";
    echo "<p>Check folder permissions or ask your hosting provider to run: <code>php artisan storage:link</code></p>";
}

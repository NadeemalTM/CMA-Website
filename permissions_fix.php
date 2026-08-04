<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Ultimate Permissions Fixer</h1>";

// Get the root of the backend (/public_html/api.new.condominium.lk)
$dir = dirname(__DIR__); 

echo "Fixing permissions for all files and folders in: <b>$dir</b><br><br>";
echo "<i>This may take 10-15 seconds to process thousands of files. Please wait...</i><br><br>";
ob_flush(); flush();

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$folderCount = 0;
$fileCount = 0;

foreach ($iterator as $item) {
    try {
        if ($item->isDir()) {
            chmod($item->getRealPath(), 0755);
            $folderCount++;
        } else {
            chmod($item->getRealPath(), 0644);
            $fileCount++;
        }
    } catch (\Exception $e) {
        // Ignore files we can't touch
    }
}

// Ensure Laravel cache folders are writable
$writableDirs = [
    $dir . '/storage',
    $dir . '/storage/app',
    $dir . '/storage/app/public',
    $dir . '/storage/framework',
    $dir . '/storage/framework/cache',
    $dir . '/storage/framework/sessions',
    $dir . '/storage/framework/views',
    $dir . '/storage/logs',
    $dir . '/bootstrap/cache',
];

foreach ($writableDirs as $wDir) {
    if (is_dir($wDir)) {
        chmod($wDir, 0775);
    }
}

echo "<h2 style='color:green;'>SUCCESS!</h2>";
echo "Fixed permissions for $folderCount folders and $fileCount files.<br>";
echo "<b>Your backend is now fully unlocked. Please go test your main website!</b>";
?>

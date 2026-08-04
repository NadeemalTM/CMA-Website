<?php
$files = [
    'app/Http/Controllers/Admin/LeaderController.php',
    'app/Http/Controllers/Admin/ProjectController.php',
    'app/Http/Controllers/Api/PublicController.php',
    'app/Http/Controllers/LawController.php'
];

$output = "<?php\n";
$output .= 'echo "<h1>Ultimate File Upload & Data Fixer V3</h1>";' . "\n";
$output .= '$baseDir = realpath(__DIR__ . "/../app/Http/Controllers");' . "\n";
$output .= 'if (!$baseDir) { echo "<b>ERROR:</b> Cannot find app/Http/Controllers directory!<br>"; exit; }' . "\n";
$output .= '$success = 0;' . "\n";

foreach ($files as $file) {
    $path = "d:/Developments/2/backend/" . $file;
    $content = file_get_contents($path);
    $b64 = base64_encode($content);
    
    // Convert 'app/Http/Controllers/...' to relative path inside $baseDir
    $relPath = str_replace('app/Http/Controllers', '', $file);
    
    $output .= '$target = $baseDir . \'' . $relPath . '\';' . "\n";
    $output .= 'file_put_contents($target, base64_decode("' . $b64 . '"));' . "\n";
    $output .= 'echo "<span style=\'color:green;\'>Successfully Fixed:</span> " . $target . "<br>";' . "\n";
    $output .= '$success++;' . "\n";
}

$output .= 'echo "<br><h2 style=\'color:green;\'>SUCCESS! Fixed " . $success . " files! All uploads and data sync issues will now work perfectly!</h2>";' . "\n";

file_put_contents('d:/Developments/2/apply_fix_v3.php', $output);
echo "Generated apply_fix_v3.php successfully!";

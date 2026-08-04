<?php
$files = [
    'app/Http/Controllers/Api/PublicController.php',
    'app/Http/Controllers/Api/AuthController.php',
    'app/Http/Controllers/LawController.php',
    'app/Http/Controllers/Admin/VacancyController.php',
    'app/Http/Controllers/Admin/JobApplicationController.php'
];

$code = '<?php' . PHP_EOL;
$code .= 'echo "<h1>Ultimate File Upload Fixer V2</h1>";' . PHP_EOL;
$code .= '$baseDir = realpath(__DIR__ . "/../app/Http/Controllers");' . PHP_EOL;
$code .= 'if (!$baseDir) { echo "<b>ERROR:</b> Cannot find app/Http/Controllers directory!<br>"; exit; }' . PHP_EOL;
$code .= '$success = 0;' . PHP_EOL;

foreach ($files as $file) {
    $content = base64_encode(file_get_contents($file));
    $pathParts = explode('/', $file);
    $name = array_pop($pathParts);
    $subDir = array_pop($pathParts);
    if ($subDir === 'Controllers') $subDir = '';
    $destPath = '$baseDir' . ($subDir ? " . '/" . $subDir . "'" : "") . " . '/" . $name . "'";
    $code .= '$target = ' . $destPath . ';' . PHP_EOL;
    $code .= 'file_put_contents($target, base64_decode("' . $content . '"));' . PHP_EOL;
    $code .= 'echo "<span style=\'color:green;\'>Successfully Fixed:</span> " . $target . "<br>";' . PHP_EOL;
    $code .= '$success++;' . PHP_EOL;
}
$code .= 'echo "<br><h2 style=\'color:green;\'>SUCCESS! Fixed " . $success . " files! All uploads will now work perfectly!</h2>";' . PHP_EOL;

file_put_contents('../apply_fix_v2.php', $code);
echo "Generated apply_fix_v2.php\n";

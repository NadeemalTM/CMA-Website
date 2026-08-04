<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>CMA Auth Header Fixer</h1>";

// Look for .htaccess in the same directory (since they will upload it to public/)
$htaccessPath = __DIR__ . '/.htaccess';

if (!file_exists($htaccessPath)) {
    echo "<p style='color:red;'><b>Error:</b> .htaccess file not found at $htaccessPath. Creating one...</p>";
    $content = "<IfModule mod_rewrite.c>\n    RewriteEngine On\n    CGIPassAuth On\n    SetEnvIf Authorization \"(.*)\" HTTP_AUTHORIZATION=$1\n    RewriteCond %{REQUEST_FILENAME} !-d\n    RewriteCond %{REQUEST_FILENAME} !-f\n    RewriteRule ^ index.php [L]\n</IfModule>";
    file_put_contents($htaccessPath, $content);
    echo "<p style='color:green;'>Created basic .htaccess with Auth rules.</p>";
} else {
    $content = file_get_contents($htaccessPath);
    $modified = false;
    
    if (strpos($content, 'CGIPassAuth On') === false) {
        $content = preg_replace('/RewriteEngine On/i', "RewriteEngine On\n    CGIPassAuth On", $content);
        if (strpos($content, 'CGIPassAuth On') === false) {
            $content = "CGIPassAuth On\n" . $content;
        }
        $modified = true;
    }
    
    if (strpos($content, 'HTTP_AUTHORIZATION=$1') === false) {
        $content = preg_replace('/CGIPassAuth On/i', "CGIPassAuth On\n    SetEnvIf Authorization \"(.*)\" HTTP_AUTHORIZATION=$1", $content);
        $modified = true;
    }
    
    if ($modified) {
        file_put_contents($htaccessPath, $content);
        echo "<p style='color:green;'><b>Success!</b> Successfully added the Auth rules to your .htaccess file.</p>";
    } else {
        echo "<p style='color:blue;'><b>Notice:</b> The Auth rules are already in your .htaccess file.</p>";
    }
}

echo "<h3>Your current .htaccess file:</h3>";
echo "<pre style='background:#f4f4f4; padding:10px; border:1px solid #ddd;'>" . htmlspecialchars(file_get_contents($htaccessPath)) . "</pre>";
echo "<h3>Please try to log in to the Dashboard again!</h3>";
?>

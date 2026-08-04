<?php
echo "<h1>Ultimate Laravel Fileinfo Bypass Fixer</h1>";
$targetDir = realpath(__DIR__ . '/../app/Http/Controllers');

if (!$targetDir || !is_dir($targetDir)) {
    echo "<b>ERROR:</b> Could not find app/Http/Controllers directory. Are you sure you uploaded this to the public folder?<br>";
    exit;
}

echo "Scanning controllers in: $targetDir<br><br>";

$dir = new RecursiveDirectoryIterator($targetDir);
$iterator = new RecursiveIteratorIterator($dir);
$patchedCount = 0;

foreach ($iterator as $file) {
    if ($file->getExtension() === 'php') {
        $content = file_get_contents($file->getPathname());
        
        // This regex looks for: $request->file('...')->store('...', 'public')
        $newContent = preg_replace_callback(
            '/\$request->file\(([\'"].+?[\'"])\)->store\(([\'"].+?[\'"]),\s*[\'"]public[\'"]\)/', 
            function($m) {
                // Rewrites it to use storeAs() with a random filename to bypass fileinfo MIME guessing
                return "\$request->file(" . $m[1] . ")->storeAs(" . $m[2] . ", \Illuminate\Support\Str::random(40) . '.' . \$request->file(" . $m[1] . ")->getClientOriginalExtension(), 'public')";
            }, 
            $content
        );

        if ($content !== $newContent) {
            if (is_writable($file->getPathname())) {
                file_put_contents($file->getPathname(), $newContent);
                echo "<span style='color:green;'>Patched:</span> " . $file->getBasename() . "<br>";
                $patchedCount++;
            } else {
                echo "<span style='color:red;'>FAILED (Permission Denied):</span> " . $file->getBasename() . "<br>";
            }
        }
    }
}

if ($patchedCount > 0) {
    echo "<br><h2 style='color: green;'>SUCCESS! Patched $patchedCount controllers!</h2>";
    echo "All file upload forms (Leadership, Hero Slides, Documents, etc) should now work perfectly without the fileinfo extension!";
} else {
    echo "<br><b>No files needed patching, or they were already patched!</b>";
}

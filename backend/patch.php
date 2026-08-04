<?php
$dir = new RecursiveDirectoryIterator('app/Http/Controllers');
$iterator = new RecursiveIteratorIterator($dir);
foreach ($iterator as $file) {
    if ($file->getExtension() === 'php') {
        $content = file_get_contents($file->getPathname());
        
        // This regex looks for: $request->file('...')->store('...', 'public')
        $newContent = preg_replace_callback(
            '/\$request->file\(([\'"].+?[\'"])\)->store\(([\'"].+?[\'"]),\s*[\'"]public[\'"]\)/', 
            function($m) {
                // Returns: $request->file('...')->storeAs('...', \Illuminate\Support\Str::random(40) . "." . $request->file('...')->getClientOriginalExtension(), "public")
                return "\$request->file(" . $m[1] . ")->storeAs(" . $m[2] . ", \Illuminate\Support\Str::random(40) . '.' . \$request->file(" . $m[1] . ")->getClientOriginalExtension(), 'public')";
            }, 
            $content
        );

        if ($content !== $newContent) {
            file_put_contents($file->getPathname(), $newContent);
            echo 'Patched: ' . $file->getPathname() . PHP_EOL;
        }
    }
}
echo "Done.\n";

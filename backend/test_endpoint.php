<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::find(2); // Kamal (citizen)
$request = Illuminate\Http\Request::create('/api/v1/certificates/my-payments', 'GET');
$request->setUserResolver(function() use ($user) {
    return $user;
});

$controller = new App\Http\Controllers\Api\CertificateController();
$response = $controller->myPayments($request);
print_r(json_decode($response->getContent(), true));

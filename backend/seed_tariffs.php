<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ApplicationTariff;

ApplicationTariff::truncate();

$renewal = [
    ['Up to 1,000', 2000],
    ['1,001-3,000', 7500],
    ['3,001-5,000', 15000],
    ['5,001-10,000', 20000],
    ['Above 10,000', 25000],
];
foreach ($renewal as $i => $r) {
    ApplicationTariff::create([
        'category' => 'Renewal Certificate charges',
        'description_en' => $r[0],
        'fee' => $r[1],
        'order' => $i,
        'remarks' => 'And added Tax and Other charges by the Government'
    ]);
}

$transfer = [
    ['Up to 1,000', 2000],
    ['1,001-3,000', 110000],
    ['3,001-5,000', 150000],
    ['5,001-10,000', 200000],
    ['10,001-20,000', 250000],
    ['20,001-30,000', 300000],
    ['30,001-40,000', 350000],
    ['40,001-50,000', 400000],
    ['Above 50,000', 450000],
];
foreach ($transfer as $i => $r) {
    ApplicationTariff::create([
        'category' => 'Transferring Certificate charges',
        'description_en' => $r[0],
        'fee' => $r[1],
        'order' => $i
    ]);
}

$general = [
    ['Condominium Plan Registration (Under 5 Units)', 15000, null],
    ['Condominium Plan Registration (5 to 20 Units)', 25000, null],
    ['Condominium Plan Registration (More than 20 Units)', 25000, '+ LKR 500 per additional unit'],
    ['Amendment of a Registered Condominium Plan', 20000, null],
    ['Management Corporation (MC) Registration', 10000, null],
    ['Structural Stability Certificate Auditing Fee', 15000, null],
];
foreach ($general as $i => $r) {
    ApplicationTariff::create([
        'category' => 'General Registration Fees',
        'description_en' => $r[0],
        'fee' => $r[1],
        'remarks' => $r[2],
        'order' => $i
    ]);
}

echo "Database Seeded successfully.\n";

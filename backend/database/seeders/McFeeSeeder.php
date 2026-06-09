<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\McFee;

class McFeeSeeder extends Seeder
{
    public function run(): void
    {
        $fees = [
            [
                'description_en' => 'Issue of Application Form',
                'description_si' => 'අයදුම්පත නිකුත් කිරීම',
                'description_ta' => 'விண்ணப்பப் படிவம் வழங்குதல்',
                'category' => 'application',
                'fee' => 250.00,
                'nbt' => 5.00,
                'vat' => 30.90,
                'total' => 285.90,
                'order' => 1,
            ],
            [
                'description_en' => 'Tsunami MC',
                'description_si' => 'සුනාමි කළමනාකරණ සංගමය',
                'description_ta' => 'சுனாமி மேலாண்மைக் கழகம்',
                'category' => 'registration',
                'fee' => 200.00,
                'nbt' => 4.00,
                'vat' => 24.48,
                'total' => 228.48,
                'order' => 2,
            ],
            [
                'description_en' => 'NHDA Management Committee',
                'description_si' => 'ජාතික නිවාස සංවර්ධන අධිකාරී කළමනාකරණ කමිටුව',
                'description_ta' => 'NHDA மேலாண்மைக் குழு',
                'category' => 'registration',
                'fee' => 250.00,
                'nbt' => 5.00,
                'vat' => 30.60,
                'total' => 285.60,
                'order' => 3,
            ],
            [
                'description_en' => 'NHDA Management Corporation',
                'description_si' => 'ජාතික නිවාස සංවර්ධන අධිකාරී කළමනාකරණ සංස්ථාව',
                'description_ta' => 'NHDA மேலாண்மைக் கழகம்',
                'category' => 'registration',
                'fee' => 500.00,
                'nbt' => 10.00,
                'vat' => 61.20,
                'total' => 571.20,
                'order' => 4,
            ],
            [
                'description_en' => '10 Parcels',
                'description_si' => 'කොටස් 10',
                'description_ta' => '10 அலகுகள்',
                'category' => 'registration',
                'fee' => 1000.00,
                'nbt' => 20.00,
                'vat' => 122.40,
                'total' => 1142.40,
                'order' => 5,
            ],
            [
                'description_en' => '11-20 Parcels',
                'description_si' => 'කොටස් 11-20',
                'description_ta' => '11-20 அலகுகள்',
                'category' => 'registration',
                'fee' => 1500.00,
                'nbt' => 30.00,
                'vat' => 183.60,
                'total' => 1713.60,
                'order' => 6,
            ],
            [
                'description_en' => '21-30 Parcels',
                'description_si' => 'කොටස් 21-30',
                'description_ta' => '21-30 அலகுகள்',
                'category' => 'registration',
                'fee' => 2500.00,
                'nbt' => 50.00,
                'vat' => 306.00,
                'total' => 2856.00,
                'order' => 7,
            ],
            [
                'description_en' => '31-40 Parcels',
                'description_si' => 'කොටස් 31-40',
                'description_ta' => '31-40 அலகுகள்',
                'category' => 'registration',
                'fee' => 3500.00,
                'nbt' => 70.00,
                'vat' => 428.40,
                'total' => 3998.40,
                'order' => 8,
            ],
            [
                'description_en' => '41 Above',
                'description_si' => 'කොටස් 41 හෝ ඊට වැඩි',
                'description_ta' => '41 இற்கு மேல்',
                'category' => 'registration',
                'fee' => 5000.00,
                'nbt' => 100.00,
                'vat' => 612.00,
                'total' => 5712.00,
                'order' => 9,
            ],
        ];

        foreach ($fees as $fee) {
            McFee::create($fee);
        }
    }
}

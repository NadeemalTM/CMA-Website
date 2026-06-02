<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('staff_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('department_en');
            $table->string('department_si')->nullable();
            $table->string('department_ta')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed real-world 32 staff members with automated Google Translate API translations
        $staffData = [
            [
                'name' => 'Mr. J.N. Nanayakkara',
                'title_en' => 'Chairman',
                'phone' => '011 2334151',
                'email' => 'chairman@condominium.lk',
                'department_en' => 'Chairman & Board of Directors',
                'order' => 1
            ],
            [
                'name' => 'Mr. Arch. M.T.K. Priyantha',
                'title_en' => 'General Manager / Director to the Board Secretary',
                'phone' => '011-2424027',
                'email' => 'gm@condominium.lk',
                'department_en' => 'Chairman & Board of Directors',
                'order' => 2
            ],
            [
                'name' => 'Mrs. W.K.D. Danston',
                'title_en' => 'Director / Director I, Department of Public Finance (Treasury Member)',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 3
            ],
            [
                'name' => 'Eng. K.A. Janaka',
                'title_en' => 'Director / General Manager, National Housing Development Board',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 4
            ],
            [
                'name' => 'Eng. T. Bharathithasan',
                'title_en' => 'Director / General Manager, National Water Supply & Drainage Board',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 5
            ],
            [
                'name' => 'Mr. Damitha Kumarasinghe',
                'title_en' => 'Director / Director General, Public Utility Commission of Sri Lanka (PUCSL)',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 6
            ],
            [
                'name' => 'Mr. Palitha Nanayakkara',
                'title_en' => 'Director / Municipal Commissioner, Colombo Municipal Council',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 7
            ],
            [
                'name' => 'Mrs. Shalika S Ranaweera',
                'title_en' => 'Director / Municipal Commissioner, Sri Jayawardenepura Kotte Municipal Council',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 8
            ],
            [
                'name' => 'Mr. Vidura Sampath',
                'title_en' => 'Director / Municipal Commissioner, Dehiwala - Mt. Lavinia Municipal Council',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 9
            ],
            [
                'name' => 'Ms. Manoja S Pathirana',
                'title_en' => 'Director / Municipal Commissioner, Moratuwa Municipal Council',
                'phone' => null,
                'email' => null,
                'department_en' => 'Chairman & Board of Directors',
                'order' => 10
            ],
            [
                'name' => 'Mr. Eng. Nalin Gankanda',
                'title_en' => 'Deputy General Manager (Regulatory)',
                'phone' => '011-2382710',
                'email' => 'dgmr@cma.lk',
                'department_en' => 'Senior Management',
                'order' => 11
            ],
            [
                'name' => 'Mrs. M.U.N. De Silva',
                'title_en' => 'Deputy General Manager (Finance)',
                'phone' => '011-2321585',
                'email' => 'dgmf@cma.lk',
                'department_en' => 'Senior Management',
                'order' => 12
            ],
            [
                'name' => 'Mrs. J.A.N.P.W. Palpita',
                'title_en' => 'Asst. General Manager (Regulatory)',
                'phone' => '011-2323366',
                'email' => 'agm_reg@condominium.lk',
                'department_en' => 'Regulatory Division',
                'order' => 13
            ],
            [
                'name' => 'Mrs. Naveesha Karunarathna',
                'title_en' => 'Asst. General Manager (Human Resource)',
                'phone' => '012-2320266',
                'email' => 'hr@cma.lk',
                'department_en' => 'Administration & HR',
                'order' => 14
            ],
            [
                'name' => 'Mrs. U.S. Indurangi Somarathna',
                'title_en' => 'Asst. General Manager (Legal)',
                'phone' => '011-2335351',
                'email' => 'legal@condominium.lk',
                'department_en' => 'Legal Division',
                'order' => 15
            ],
            [
                'name' => 'Mrs. Thanuja Thennakoon',
                'title_en' => 'Asst. General Manager (Legal)',
                'phone' => '011-2335351',
                'email' => 'legal@condominium.lk',
                'department_en' => 'Legal Division',
                'order' => 16
            ],
            [
                'name' => 'Mr. W.H.S. Chandana',
                'title_en' => 'Asst. General Manager (Operations & Maintenance)',
                'phone' => '011-2333439',
                'email' => 'agm.om.zone2@cma.lk',
                'department_en' => 'Operations & Maintenance',
                'order' => 17
            ],
            [
                'name' => 'Internal Auditor (Office)',
                'title_en' => 'Internal Auditor',
                'phone' => '011-5757182',
                'email' => 'internal.auditor@cma.lk',
                'department_en' => 'Internal Audit',
                'order' => 18
            ],
            [
                'name' => 'Mrs. S.H.R.P. Hewage',
                'title_en' => 'Asst. General Manager (Operations & Maintenance)',
                'phone' => '011-2421387',
                'email' => 'agm.om.zone2@cma.lk',
                'department_en' => 'Operations & Maintenance',
                'order' => 19
            ],
            [
                'name' => 'Mrs. D.A.T. Harshani',
                'title_en' => 'Asst. General Manager (Operations & Maintenance)',
                'phone' => '011-2447432',
                'email' => null,
                'department_en' => 'Operations & Maintenance',
                'order' => 20
            ],
            [
                'name' => 'Mr. P. Amila Nishantha',
                'title_en' => 'Asst. General Manager (Finance)',
                'phone' => '011-2331708',
                'email' => 'agm.finance@cma.lk',
                'department_en' => 'Finance Division',
                'order' => 21
            ],
            [
                'name' => 'Mrs. Samantha Ampagala',
                'title_en' => 'Assistant General Manager (Customer Care)',
                'phone' => '011-2391669',
                'email' => 'customercare@condominium.lk',
                'department_en' => 'Customer Care Division',
                'order' => 22
            ],
            [
                'name' => 'Sujani Kosal',
                'title_en' => 'Asst. General Manager (Operations & Maintenance)',
                'phone' => '011-2447432',
                'email' => 'agm.om.zone3@cma.lk',
                'department_en' => 'Operations & Maintenance',
                'order' => 23
            ],
            [
                'name' => 'Mr. G.A.U.T. Sampath',
                'title_en' => 'Management Information Systems Officer',
                'phone' => '011-34219535',
                'email' => 'mis.officer@cma.lk',
                'department_en' => 'MIS Division',
                'order' => 24
            ],
            [
                'name' => 'Mrs. S.P.Y.D.S. Lakmali',
                'title_en' => 'Senior Engineering Assistant',
                'phone' => null,
                'email' => null,
                'department_en' => 'Engineering Division',
                'order' => 25
            ],
            [
                'name' => 'Mr. P.R. Nalaka',
                'title_en' => 'Senior Engineering Assistant',
                'phone' => null,
                'email' => null,
                'department_en' => 'Engineering Division',
                'order' => 26
            ],
            [
                'name' => 'Mrs. Dilini Dayarathne',
                'title_en' => 'Senior Engineering Assistant',
                'phone' => '011-2447432',
                'email' => null,
                'department_en' => 'Engineering Division',
                'order' => 27
            ],
            [
                'name' => 'Mrs. Thushani Lokuge',
                'title_en' => 'Administration Officer',
                'phone' => '011-2471387',
                'email' => 'hr@cma.lk',
                'department_en' => 'Administration & HR',
                'order' => 28
            ],
            [
                'name' => 'Miss. H.H.S. Pallewattha',
                'title_en' => 'Internal Audit Officer',
                'phone' => null,
                'email' => null,
                'department_en' => 'Internal Audit',
                'order' => 29
            ],
            [
                'name' => 'Mrs. Chamila Subashani',
                'title_en' => 'Accounts Officer',
                'phone' => '011-2447432',
                'email' => 'account.officer@cma.lk',
                'department_en' => 'Finance Division',
                'order' => 30
            ],
            [
                'name' => 'K.M. Sanjeewani Priyangika',
                'title_en' => 'Secretary',
                'phone' => null,
                'email' => null,
                'department_en' => 'Administration & HR',
                'order' => 31
            ],
            [
                'name' => 'L.W.S.M. Wicramasinghe',
                'title_en' => 'Secretary',
                'phone' => '011-2447432',
                'email' => null,
                'department_en' => 'Administration & HR',
                'order' => 32
            ]
        ];

        // Cache translations to avoid repeated cURL requests for the same departments
        $deptCache = [];

        foreach ($staffData as $item) {
            $deptEn = $item['department_en'];
            
            if (!isset($deptCache[$deptEn])) {
                $deptCache[$deptEn] = [
                    'si' => $this->translateText($deptEn, 'si') ?? $deptEn,
                    'ta' => $this->translateText($deptEn, 'ta') ?? $deptEn
                ];
            }

            $titleSi = $this->translateText($item['title_en'], 'si') ?? $item['title_en'];
            $titleTa = $this->translateText($item['title_en'], 'ta') ?? $item['title_en'];

            DB::table('staff_members')->insert([
                'name' => $item['name'],
                'title_en' => $item['title_en'],
                'title_si' => $titleSi,
                'title_ta' => $titleTa,
                'phone' => $item['phone'],
                'email' => $item['email'],
                'department_en' => $deptEn,
                'department_si' => $deptCache[$deptEn]['si'],
                'department_ta' => $deptCache[$deptEn]['ta'],
                'order' => $item['order'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_members');
    }

    private function translateText(string $text, string $target): ?string
    {
        try {
            $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" . $target . "&dt=t&q=" . urlencode($text);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
            curl_setopt($ch, CURLOPT_TIMEOUT, 8);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($ch);
            curl_close($ch);

            if (!$response) return null;

            $result = json_decode($response, true);
            if (isset($result[0])) {
                $translated = '';
                foreach ($result[0] as $sentence) {
                    if (isset($sentence[0])) {
                        $translated .= $sentence[0];
                    }
                }
                return $translated ?: null;
            }
        } catch (\Exception $e) {
            // fallback
        }
        return null;
    }
};

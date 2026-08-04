<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Leader;
use App\Models\HeroSlide;
use App\Models\Announcement;
use App\Models\NewsEvent;
use App\Models\Vacancy;
use App\Models\Document;
use App\Models\Project;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Never overwrite the production super administrator password when reseeding.
        $superAdmin = User::where('email', User::SUPER_ADMIN_EMAIL)->first();
        if ($superAdmin) {
            $superAdmin->update([
                'name' => 'Super Administrator',
                'role' => 'super_admin',
                'admin_permissions' => array_keys(config('admin_permissions', [])),
                'is_active' => true,
            ]);
        } elseif ($password = env('SUPER_ADMIN_PASSWORD')) {
            User::create([
                'name' => 'Super Administrator',
                'email' => User::SUPER_ADMIN_EMAIL,
                'password' => Hash::make($password),
                'role' => 'super_admin',
                'admin_permissions' => array_keys(config('admin_permissions', [])),
                'is_active' => true,
            ]);
        } else {
            $this->command?->warn('Super administrator was not seeded because SUPER_ADMIN_PASSWORD is not configured.');
        }

        // Hero Slides
        HeroSlide::insert([
            ['title_en'=>'Building Sri Lanka\'s Urban Future Together','title_si'=>'ශ්‍රී ලංකාවේ නාගරික අනාගතය ගොඩනඟමු','title_ta'=>'இலங்கையின் நகர்ப்புற எதிர்காலத்தை ஒன்றாக கட்டமைப்போம்','subtitle_en'=>'Condominium Management Authority','subtitle_si'=>'සහාධිපත්‍ය කළමනාකරණ අධිකාරිය','subtitle_ta'=>'அடுக்குமாடி குடியிருப்பு மேலாண்மை ஆணையம்','description_en'=>'Sri Lanka\'s premier regulatory body for condominium properties','description_si'=>'ශ්‍රී ලංකාවේ සහාධිපත්‍ය දේපළ සඳහා ප්‍රමුඛ නියාමන ආයතනය','description_ta'=>'இலங்கையின் முன்னணி ஒழுங்குமுறை அமைப்பு','image'=>null,'button_text_en'=>'Learn More','button_link'=>'/about','order'=>1,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Ensuring Excellence in Condominium Living','title_si'=>'සහාධිපත්‍ය ජීවිතයේ විශිෂ්ටතාව සහතික කිරීම','title_ta'=>'அடுக்குமாடி வாழ்வில் சிறப்பை உறுதி செய்கிறோம்','subtitle_en'=>'Empowering Communities','subtitle_si'=>'ප්‍රජාවන් සවිබල ගැන්වීම','subtitle_ta'=>'சமூகங்களை வலுப்படுத்துகிறோம்','description_en'=>'Efficient, transparent and fair management practices across Sri Lanka','description_si'=>'ශ්‍රී ලංකාව පුරා කාර්යක්ෂම, විනිවිද පෙනෙන කළමනාකරණය','description_ta'=>'திறமையான, வெளிப்படையான நிர்வாக நடைமுறைகள்','image'=>null,'button_text_en'=>'Our Services','button_link'=>'/applications','order'=>2,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
        ]);

        // Leadership
        Leader::insert([
            ['name_en'=>'Anura Kumara Dissanayake','name_si'=>'අනුර කුමාර දිසානායක','name_ta'=>'அநுர குமார திசாநாயக்க','position_en'=>'President of the Democratic Socialist Republic of Sri Lanka','position_si'=>'ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජයේ ජනාධිපති','position_ta'=>'ஜனாதிபதி','photo'=>null,'order'=>1,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name_en'=>'Harini Amarasuriya','name_si'=>'හරිනි අමරසූරිය','name_ta'=>'ஹரிணி அமரசூரிய','position_en'=>'Hon. Prime Minister of the Democratic Socialist Republic of Sri Lanka','position_si'=>'ගරු අග්‍රාමාත්‍ය','position_ta'=>'கௌரவ பிரதமர்','photo'=>null,'order'=>2,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name_en'=>'Bimal Rathnayake','name_si'=>'බිමල් රත්නායක','name_ta'=>'பிமல் ரத்நாயக்க','position_en'=>'Hon. Minister of the Democratic Socialist Republic of Sri Lanka','position_si'=>'ගරු ඇමතිතුමා','position_ta'=>'கௌரவ அமைச்சர்','photo'=>null,'order'=>3,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name_en'=>'Eranga Gunasekara','name_si'=>'එරංග ගුණසේකර','name_ta'=>'எரங்க குணசேகர','position_en'=>'Deputy Minister of Urban Development of Sri Lanka','position_si'=>'නාගරික සංවර්ධන නියෝජ්‍ය ඇමතිතුමා','position_ta'=>'துணை அமைச்சர்','photo'=>null,'order'=>4,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name_en'=>'Bandula Karunarathne','name_si'=>'බන්දුල කරුණාරත්න','name_ta'=>'பந்துல கருணாரத்ன','position_en'=>'Chairman of the Condominium Management Authority','position_si'=>'සහාධිපත්‍ය කළමනාකරණ අධිකාරියේ සභාපති','position_ta'=>'தலைவர்','photo'=>null,'order'=>5,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
        ]);

        // Announcements
        Announcement::insert([
            ['text_en'=>'Vacancies: Applications invited for Architect, Mason, Caretaker & Book Binder. Deadline: 20 Feb 2026','text_si'=>'පුරප්පාඩු: ගෘහ නිර්මාණ ශිල්පී, කොන්ත්‍රාත්කරු, භාරකරු සඳහා අයඳුම්','text_ta'=>'காலி இடங்கள்: கட்டிட வல்லுனர், கொத்தனார் பதவிகளுக்கு விண்ணப்பங்கள்','link'=>'/careers','is_active'=>1,'order'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['text_en'=>'Special Announcement for all Apartment Unit Owners & Residents – Click to view','text_si'=>'සියලු මහල් නිවාස හිමිකරුවන් සඳහා විශේෂ නිවේදනය','text_ta'=>'அனைத்து அடுக்குமாடி உரிமையாளர்களுக்கு சிறப்பு அறிவிப்பு','link'=>'/news','is_active'=>1,'order'=>2,'created_at'=>now(),'updated_at'=>now()],
        ]);

        // News
        NewsEvent::insert([
            ['title_en'=>'Clean Sri Lanka Project Initiative','title_si'=>'ශ්‍රී ලංකාව පිරිසිදු කිරීමේ ව්‍යාපෘතිය','title_ta'=>'சுத்தமான இலங்கை திட்டம்','excerpt_en'=>'CMA participates in the national Clean Sri Lanka initiative to beautify condominium complexes.','slug'=>'clean-sri-lanka-project','category'=>'news','is_published'=>1,'published_at'=>'2026-01-15 00:00:00','body_en'=>'<p>As part of the Clean Sri Lanka Project, the cleaning initiative for apartment schemes is scheduled to commence. The Condominium Management Authority is committed to maintaining clean and green living spaces across all registered condominiums.</p>','created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Real Estate Agents Advised to Ramp up AML Measures','title_si'=>'දේපළ නියෝජිතයන්ට AML ක්‍රියාමාර්ග ශක්තිමත් කරන ලෙස උපදෙස්','title_ta'=>'ரியல் எஸ்டேட் முகவர்களுக்கு AML நடவடிக்கைகளை வலுப்படுத்த அறிவுரை','excerpt_en'=>'FIU organized an awareness program on Anti-Money Laundering obligations for real estate sector.','slug'=>'aml-awareness-2023','category'=>'event','is_published'=>1,'published_at'=>'2023-07-11 00:00:00','body_en'=>'<p>The Financial Intelligence Unit (FIU) of the Central Bank of Sri Lanka organized an awareness program on AML/CFT Compliance Obligations. The Chairman of the Condominium Management Authority also attended.</p>','created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Registration of Property Developers – 2026','title_si'=>'දේපළ සංවර්ධකයන් ලියාපදිංචි කිරීම – 2026','title_ta'=>'சொத்து உருவாக்குனர்களின் பதிவு – 2026','excerpt_en'=>'Information gathering for property developers is now open. Download the application form.','slug'=>'property-developer-registration-2026','category'=>'announcement','is_published'=>1,'published_at'=>'2026-01-10 00:00:00','body_en'=>'<p>The Condominium Management Authority is gathering information of property developers for the year 2026. All registered and new developers are requested to submit their updated information.</p>','created_at'=>now(),'updated_at'=>now()],
        ]);

        // Vacancies
        Vacancy::insert([
            ['title_en'=>'Architect','title_si'=>'ගෘහ නිර්මාණ ශිල්පී','title_ta'=>'கட்டிட வல்லுனர்','description_en'=>'<p>Applications are invited for a qualified Architect with a degree in Architecture and minimum 3 years experience in the construction industry.</p>','is_active'=>1,'deadline'=>'2026-02-20','created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Mason','title_si'=>'කොන්ත්‍රාත්කරු','title_ta'=>'கொத்தனார்','description_en'=>'<p>Experienced Mason required for maintenance work at CMA managed properties. Minimum 5 years of experience required.</p>','is_active'=>1,'deadline'=>'2026-02-20','created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Caretaker','title_si'=>'භාරකරු','title_ta'=>'பராமரிப்பாளர்','description_en'=>'<p>Caretaker required for condominium complexes. Duties include general maintenance and security assistance.</p>','is_active'=>1,'deadline'=>'2026-02-20','created_at'=>now(),'updated_at'=>now()],
        ]);

        // Documents
        Document::insert([
            ['title_en'=>'Condominium Property Act No. 12 of 1973','title_si'=>'සහාධිපත්‍ය දේපළ පනත','title_ta'=>'அடுக்குமாடி சொத்து சட்டம்','type'=>'law','category'=>'acts','file_path'=>'documents/placeholder.pdf','language'=>'en','year'=>1973,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Apartment Ownership Law No. 11 of 1973','title_si'=>'මහල් නිවාස හිමිකාර නීතිය','title_ta'=>'குடியிருப்பு உரிமை சட்டம்','type'=>'law','category'=>'acts','file_path'=>'documents/placeholder.pdf','language'=>'en','year'=>1973,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Common Amenities Board Act No. 24 of 2003','title_si'=>'පොදු පහසුකම් මණ්ඩල පනත','title_ta'=>'பொது வசதிகள் குழு சட்டம்','type'=>'law','category'=>'acts','file_path'=>'documents/placeholder.pdf','language'=>'en','year'=>2003,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'SAHADHIPATHYA Paper Vol. 1','title_si'=>'සහාධිපත්‍ය පත්‍රිකාව','title_ta'=>'சஹாதிபத்திய இதழ்','type'=>'publication','category'=>'magazine','file_path'=>'documents/placeholder.pdf','language'=>'si','year'=>2015,'is_active'=>1,'created_at'=>now(),'updated_at'=>now()],
        ]);

        // Projects
        Project::insert([
            ['title_en'=>'Urban Community Renewal Programme','title_si'=>'නාගරික ප්‍රජා ප්‍රතිනිර්මාණ වැඩසටහන','title_ta'=>'நகர்ப்புற சமூக புதுப்பித்தல் திட்டம்','description_en'=>'A comprehensive programme to renew and upgrade aging condominium complexes across major urban centres in Sri Lanka.','status'=>'ongoing','location'=>'Colombo, Kandy, Galle','is_active'=>1,'start_date'=>'2024-01-01','created_at'=>now(),'updated_at'=>now()],
            ['title_en'=>'Digital Management System for MCs','title_si'=>'කළමනාකරණ සංගම් සඳහා ඩිජිටල් පද්ධතිය','title_ta'=>'MC களுக்கான டிஜிட்டல் மேலாண்மை அமைப்பு','description_en'=>'Implementation of a digital platform for Management Corporations to handle fees, complaints and maintenance requests online.','status'=>'planned','location'=>'Island-wide','is_active'=>1,'start_date'=>'2026-06-01','created_at'=>now(),'updated_at'=>now()],
        ]);

        $this->call([
            CertificateSeeder::class,
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CertificateType;
use App\Models\CertificateDocument;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Preliminary Planning Clearance (PPC)
        $ppc = CertificateType::updateOrCreate(['code' => 'ppc'], [
            'title_en' => 'Preliminary Planning Clearance (PPC)',
            'title_si' => 'මූලික සැලසුම් අනුමැතිය (PPC)',
            'title_ta' => 'முன்னோடி திட்டமிடல் அனுமதி (PPC)',
            'instructions_en' => "# Requirements for Preliminary Planning Clearance (PPC)\n- Duly completed application form.\n- Copies of building plans approved by the local authority.\n- Survey plan of the land.\n- Copy of the deed.\n- Relevant clearances from other government authorities.\n\nPlease click 'Download Document' below to pay the document fee and access the downloadable files.",
            'instructions_si' => "# මූලික සැලසුම් අනුමැතිය (PPC) සඳහා අවශ්‍යතා\n- නිවැරදිව සම්පූර්ණ කරන ලද අයදුම්පත.\n- පළාත් පාලන ආයතනය විසින් අනුමත කරන ලද ගොඩනැගිලි සැලසුම්වල පිටපත්.\n- ඉඩමේ මිනින්දෝරු සැලැස්ම.\n- ඔප්පුවේ පිටපතක්.",
            'instructions_ta' => "# முன்னோடி திட்டமிடல் அனுமதி (PPC) க்கான தேவைகள்\n- முறையாக பூர்த்தி செய்யப்பட்ட விண்ணப்பப் படிவம்.\n- உள்ளூர் அதிகாரசபையால் அங்கீகரிக்கப்பட்ட கட்டிட திட்டங்களின் பிரதிகள்.\n- நிலத்தின் அளவீட்டு வரைபடம்.\n- பத்திரத்தின் நகல்.",
            'document_fee' => 5000.00,
            'order' => 1,
            'is_active' => true,
        ]);

        // 2. Provisional Condominium Certificate
        $provisional = CertificateType::updateOrCreate(['code' => 'provisional'], [
            'title_en' => 'Provisional Condominium Certificate',
            'title_si' => 'තත්කාලීන සහාධිපත්‍ය සහතිකය',
            'title_ta' => 'தற்காலிக அடுக்குமாடி குடியிருப்பு சான்றிதழ்',
            'instructions_en' => "# Requirements for Provisional Condominium Certificate\n- Approved architectural plans showing proposed units.\n- Draft declaration of the condominium.\n- Schedule of share values for each unit.\n- Receipt of the processing fee payment.\n\nPlease click 'Download Document' below to pay the document fee and access the downloadable files.",
            'instructions_si' => "# තත්කාලීන සහාධිපත්‍ය සහතිකය සඳහා අවශ්‍යතා\n- යෝජිත ඒකක පෙන්වන අනුමත ගෘහ නිර්මාණ සැලසුම්.\n- සහාධිපත්‍යයේ කෙටුම්පත් ප්‍රකාශය.\n- එක් එක් ඒකකය සඳහා කොටස් අගයන්ගේ උපලේඛනය.",
            'instructions_ta' => "# தற்காலிக அடுக்குமாடி குடியிருப்பு சான்றிதழுக்கான தேவைகள்\n- முன்மொழியப்பட்ட அலகுகளைக் காட்டும் அங்கீகரிக்கப்பட்ட கட்டிடக்கலை திட்டங்கள்.\n- அடுக்குமாடி குடியிருப்பின் வரைவு பிரகடனம்.\n- ஒவ்வொரு அலகுக்குமான பங்கு மதிப்புகளின் அட்டவணை.",
            'document_fee' => 7500.00,
            'order' => 2,
            'is_active' => true,
        ]);

        // 3. Semi Condominium Certificate
        $semi = CertificateType::updateOrCreate(['code' => 'semi'], [
            'title_en' => 'Semi Condominium Certificate',
            'title_si' => 'අර්ධ සහාධිපත්‍ය සහතිකය',
            'title_ta' => 'அரை அடுக்குமாடி குடியிருப்பு சான்றிதழ்',
            'instructions_en' => "# Requirements for Semi Condominium Certificate\n- Certification of partially completed building.\n- Registered survey plan showing existing structures and common elements.\n- Draft condominium declaration.\n- Clearance from structural engineer.\n\nPlease click 'Download Document' below to pay the document fee and access the downloadable files.",
            'instructions_si' => "# අර්ධ සහාධිපත්‍ය සහතිකය සඳහා අවශ්‍යතා\n- කොටසක් නිම කරන ලද ගොඩනැගිල්ලේ සහතිකය.\n- පවතින ව්‍යුහයන් සහ පොදු අංග පෙන්වන ලියාපදිංචි මිනින්දෝරු සැලැස්ම.\n- ව්‍යුහාත්මක ඉංජිනේරු නිශ්කාෂණය.",
            'instructions_ta' => "# அரை அடுக்குமாடி குடியிருப்பு சான்றிதழுக்கான தேவைகள்\n- பகுதி பூர்த்தி செய்யப்பட்ட கட்டிடத்தின் சான்றிதழ்.\n- தற்போதுள்ள கட்டமைப்புகள் மற்றும் பொதுவான கூறுகளைக் காட்டும் பதிவு செய்யப்பட்ட அளவீட்டு வரைபடம்.\n- கட்டமைப்பு பொறியியலாளரின் அனுமதி.",
            'document_fee' => 10000.00,
            'order' => 3,
            'is_active' => true,
        ]);

        // 4. Final Condominium Certificate
        $final = CertificateType::updateOrCreate(['code' => 'final'], [
            'title_en' => 'Final Condominium Certificate',
            'title_si' => 'අවසාන සහාධිපත්‍ය සහතිකය',
            'title_ta' => 'இறுதி அடுக்குமாடி குடியிருப்பு சான்றிதழ்',
            'instructions_en' => "# Requirements for Final Condominium Certificate\n- Certificate of Conformity (CoC) from local authority.\n- Final registered condominium survey plan prepared by a licensed surveyor.\n- Final declaration and articles of association of the Management Corporation.\n- Fire clearance certificate and structural stability report.\n\nPlease click 'Download Document' below to pay the document fee and access the downloadable files.",
            'instructions_si' => "# අවසාන සහාධිපත්‍ය සහතිකය සඳහා අවශ්‍යතා\n- පළාත් පාලන ආයතනයෙන් අනුකූලතා සහතිකය (CoC).\n- බලපත්‍රලාභී මිනින්දෝරුවෙකු විසින් සකස් කරන ලද අවසාන ලියාපදිංචි සහාධිපත්‍ය මිනින්දෝරු සැලැස්ම.\n- කළමනාකරණ සංගමයේ අවසාන ප්‍රකාශය.",
            'instructions_ta' => "# இறுதி அடுக்குமாடி குடியிருப்பு சான்றிதழுக்கான தேவைகள்\n- உள்ளூர் அதிகாரசபையின் இணக்கச் சான்றிதழ் (CoC).\n- உரிமம் பெற்ற அளவையாளரால் தயாரிக்கப்பட்ட இறுதி பதிவு செய்யப்பட்ட அடுக்குமாடி அளவீட்டு வரைபடம்.\n- நிர்வாகக் கழகத்தின் இறுதிப் பிரகடனம்.",
            'document_fee' => 15000.00,
            'order' => 4,
            'is_active' => true,
        ]);

        // Seed some sample documents for each
        CertificateDocument::updateOrCreate([
            'certificate_type_id' => $ppc->id,
            'title_en' => 'PPC Application Form',
        ], [
            'title_si' => 'PPC අයදුම්පත',
            'title_ta' => 'PPC விண்ணப்பப் படிவம்',
            'file_path' => 'documents/ppc_application.pdf',
            'file_name' => 'ppc_application.pdf',
            'file_type' => 'pdf',
            'order' => 1,
            'is_active' => true,
        ]);

        CertificateDocument::updateOrCreate([
            'certificate_type_id' => $provisional->id,
            'title_en' => 'Provisional Certificate Guide & Form',
        ], [
            'title_si' => 'තත්කාලීන සහතික මාර්ගෝපදේශය සහ අයදුම්පත',
            'title_ta' => 'தற்காலிக சான்றிதழ் வழிகாட்டி மற்றும் விண்ணப்பம்',
            'file_path' => 'documents/provisional_guide.pdf',
            'file_name' => 'provisional_guide.pdf',
            'file_type' => 'pdf',
            'order' => 1,
            'is_active' => true,
        ]);

        CertificateDocument::updateOrCreate([
            'certificate_type_id' => $semi->id,
            'title_en' => 'Semi Condominium Registration Forms',
        ], [
            'title_si' => 'අර්ධ සහාධිපත්‍ය ලියාපදිංචි කිරීමේ පත්‍රිකා',
            'title_ta' => 'அரை அடுக்குமாடி பதிவு படிவங்கள்',
            'file_path' => 'documents/semi_forms.pdf',
            'file_name' => 'semi_forms.pdf',
            'file_type' => 'pdf',
            'order' => 1,
            'is_active' => true,
        ]);

        CertificateDocument::updateOrCreate([
            'certificate_type_id' => $final->id,
            'title_en' => 'Final Condominium Registration Forms & CoC Checklist',
        ], [
            'title_si' => 'අවසාන සහාධිපත්‍ය ලියාපදිංචි කිරීමේ ආකෘති සහ ලේඛන ලැයිස්තුව',
            'title_ta' => 'இறுதி அடுக்குமாடி பதிவு படிவங்கள் மற்றும் சரிபார்ப்பு பட்டியல்',
            'file_path' => 'documents/final_checklist.pdf',
            'file_name' => 'final_checklist.pdf',
            'file_type' => 'pdf',
            'order' => 1,
            'is_active' => true,
        ]);
    }
}

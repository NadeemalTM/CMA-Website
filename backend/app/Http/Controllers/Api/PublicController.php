<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{HeroSlide, Leader, Announcement, NewsEvent, Vacancy, Document, Project, Condominium, Application, Complaint, Feedback};
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PublicController extends Controller
{
    public function heroSlides()
    {
        $slides = HeroSlide::where('is_active', true)->orderBy('order')->get()
            ->map(fn($s) => $this->localizeSlide($s));
        return response()->json(['data' => $slides]);
    }

    public function leaders()
    {
        $leaders = Leader::where('is_active', true)->orderBy('order')->get()
            ->map(fn($l) => $this->localizeLeader($l));
        return response()->json(['data' => $leaders]);
    }

    public function announcements()
    {
        $announcements = Announcement::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->orderBy('order')->get()
            ->map(fn($a) => $this->localizeAnnouncement($a));
        return response()->json(['data' => $announcements]);
    }

    public function news(Request $request)
    {
        $query = NewsEvent::where('is_published', true)
            ->orderByDesc('published_at');
        if ($request->category) {
            $query->where('category', $request->category);
        }
        $news = $query->paginate(12)->through(fn($n) => $this->localizeNews($n));
        return response()->json($news);
    }

    public function newsShow($slug)
    {
        $news = NewsEvent::where('slug', $slug)->where('is_published', true)->firstOrFail();
        return response()->json(['data' => $this->localizeNews($news, true)]);
    }

    public function vacancies()
    {
        $vacancies = Vacancy::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('deadline')->orWhere('deadline', '>=', now()->toDateString());
            })
            ->orderByDesc('created_at')->get()
            ->map(fn($v) => $this->localizeVacancy($v));
        return response()->json(['data' => $vacancies]);
    }

    public function documents(Request $request)
    {
        $query = Document::where('is_active', true);
        if ($request->type) $query->where('type', $request->type);
        $docs = $query->orderByDesc('year')->orderByDesc('created_at')->get()
            ->map(fn($d) => $this->localizeDocument($d));
        return response()->json(['data' => $docs]);
    }

    public function projects()
    {
        $projects = Project::where('is_active', true)->orderByDesc('created_at')->get()
            ->map(fn($p) => $this->localizeProject($p));
        return response()->json(['data' => $projects]);
    }

    public function condominiums(Request $request)
    {
        $query = Condominium::query();
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('registration_no', 'like', "%{$request->search}%")
                  ->orWhere('address', 'like', "%{$request->search}%");
        }
        if ($request->district) $query->where('district', $request->district);
        return response()->json($query->orderBy('name')->paginate(20));
    }

    public function submitApplication(Request $request)
    {
        $v = Validator::make($request->all(), [
            'applicant_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'type' => 'required|in:condo_plan,mc_registration,amendment,other',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $app = Application::create([
            'reference_no' => 'APP-' . strtoupper(Str::random(8)),
            'applicant_name' => $request->applicant_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'type' => $request->type,
            'form_data' => $request->form_data ?? [],
            'status' => 'pending',
        ]);
        return response()->json(['data' => $app, 'message' => 'Application submitted successfully.'], 201);
    }

    public function submitComplaint(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $complaint = Complaint::create($request->only('name','email','phone','subject','message'));
        return response()->json(['data' => $complaint, 'message' => 'Your message has been received.'], 201);
    }

    public function submitFeedback(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'required|string',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $message = $request->message;
        $translatedSi = $this->translateText($message, 'si') ?? $message;
        $translatedTa = $this->translateText($message, 'ta') ?? $message;

        $feedback = Feedback::create([
            'name' => $request->name,
            'email' => $request->email,
            'rating' => $request->rating,
            'message' => $message,
            'message_si' => $translatedSi,
            'message_ta' => $translatedTa,
        ]);

        return response()->json(['data' => $feedback, 'message' => 'Your feedback has been received. Thank you!'], 201);
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

    public function upload(Request $request)
    {
        $request->validate(['file' => 'required|file|max:10240']);
        $path = $request->file('file')->store('uploads', 'public');
        return response()->json(['path' => $path, 'url' => Storage::url($path)]);
    }

    // ── Localization Helpers ─────────────────────────────────────────────────
    private function lang(): string
    {
        return request()->get('lang', 'en');
    }

    private function loc($item, string $field): ?string
    {
        $lang = $this->lang();
        return $item->{$field . '_' . $lang} ?? $item->{$field . '_en'} ?? null;
    }

    private function localizeSlide($s): array
    {
        return [
            'id' => $s->id,
            'title' => $this->loc($s, 'title'),
            'subtitle' => $this->loc($s, 'subtitle'),
            'description' => $this->loc($s, 'description'),
            'button_text' => $this->loc($s, 'button_text'),
            'button_link' => $s->button_link,
            'image' => $s->image ? asset('storage/' . $s->image) : null,
            'order' => $s->order,
        ];
    }

    private function localizeLeader($l): array
    {
        return [
            'id' => $l->id,
            'name' => $l->name,
            'position' => $this->loc($l, 'position'),
            'bio' => $this->loc($l, 'bio'),
            'photo' => $l->photo ? asset('storage/' . $l->photo) : null,
            'email' => $l->email,
            'phone' => $l->phone,
            'order' => $l->order,
        ];
    }

    private function localizeAnnouncement($a): array
    {
        return [
            'id' => $a->id,
            'text' => $this->loc($a, 'text'),
            'link' => $a->link,
            'expires_at' => $a->expires_at,
        ];
    }

    private function localizeNews($n, bool $full = false): array
    {
        $data = [
            'id' => $n->id,
            'title' => $this->loc($n, 'title'),
            'excerpt' => $this->loc($n, 'excerpt'),
            'slug' => $n->slug,
            'category' => $n->category,
            'image' => $n->image ? asset('storage/' . $n->image) : null,
            'published_at' => $n->published_at?->toDateString(),
        ];
        if ($full) $data['body'] = $this->loc($n, 'body');
        return $data;
    }

    private function localizeVacancy($v): array
    {
        return [
            'id' => $v->id,
            'title' => $this->loc($v, 'title'),
            'description' => $this->loc($v, 'description'),
            'deadline' => $v->deadline?->toDateString(),
        ];
    }

    private function localizeDocument($d): array
    {
        return [
            'id' => $d->id,
            'title' => $this->loc($d, 'title'),
            'type' => $d->type,
            'category' => $d->category,
            'language' => $d->language,
            'year' => $d->year,
            'file_url' => asset('storage/' . $d->file_path),
        ];
    }

    private function localizeProject($p): array
    {
        return [
            'id' => $p->id,
            'title' => $this->loc($p, 'title'),
            'description' => $this->loc($p, 'description'),
            'image' => $p->image ? asset('storage/' . $p->image) : null,
            'status' => $p->status,
            'start_date' => $p->start_date?->toDateString(),
            'end_date' => $p->end_date?->toDateString(),
            'location' => $p->location,
        ];
    }
}

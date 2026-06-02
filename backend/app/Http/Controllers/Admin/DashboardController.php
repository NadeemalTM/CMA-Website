<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{HeroSlide, Leader, NewsEvent, Vacancy, Condominium, Application, Complaint, Project, Document, Announcement, Feedback};

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'data' => [
                'hero_slides' => HeroSlide::count(),
                'leaders' => Leader::count(),
                'news' => NewsEvent::where('is_published', true)->count(),
                'vacancies' => Vacancy::where('is_active', true)->count(),
                'condominiums' => Condominium::count(),
                'applications' => [
                    'total' => Application::count(),
                    'pending' => Application::where('status', 'pending')->count(),
                    'approved' => Application::where('status', 'approved')->count(),
                ],
                'complaints' => [
                    'total' => Complaint::count(),
                    'new' => Complaint::where('status', 'new')->count(),
                ],
                'projects' => Project::where('is_active', true)->count(),
                'documents' => Document::where('is_active', true)->count(),
                'announcements' => Announcement::where('is_active', true)->count(),
                'feedbacks' => Feedback::count(),
            ]
        ]);
    }
}

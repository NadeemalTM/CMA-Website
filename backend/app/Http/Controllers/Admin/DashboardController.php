<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\{HeroSlide, Leader, NewsEvent, Vacancy, Condominium, Application, Complaint, Project, Document, Announcement, Feedback, StaffMember};

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
                'staff' => StaffMember::count(),
            ]
        ]);
    }

    public function citizens()
    {
        $citizens = User::where('role', 'citizen')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $citizens]);
    }

    public function destroyCitizen($id)
    {
        $user = User::where('role', 'citizen')->findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function resetCitizenPassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('role', 'citizen')->findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password reset successfully']);
    }
}

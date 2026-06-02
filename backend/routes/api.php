<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\HeroSlideController;
use App\Http\Controllers\Admin\LeaderController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\NewsEventController;
use App\Http\Controllers\Admin\VacancyController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\CondominiumController;
use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Admin\BookingAdminController;
use App\Http\Controllers\Api\BungalowRoomController;

// ── Public API ──────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {
    Route::get('hero-slides', [PublicController::class, 'heroSlides']);
    Route::get('leaders', [PublicController::class, 'leaders']);
    Route::get('announcements', [PublicController::class, 'announcements']);
    Route::get('news', [PublicController::class, 'news']);
    Route::get('bungalow-rooms', [BungalowRoomController::class, 'index']);
    Route::get('bookings/availability', [BookingController::class, 'getAvailability']);

    Route::get('news/{slug}', [PublicController::class, 'newsShow']);
    Route::get('vacancies', [PublicController::class, 'vacancies']);
    Route::get('documents', [PublicController::class, 'documents']);
    Route::get('projects', [PublicController::class, 'projects']);
    Route::get('condominiums', [PublicController::class, 'condominiums']);
    Route::post('applications', [PublicController::class, 'submitApplication']);
    Route::post('complaints', [PublicController::class, 'submitComplaint']);
    Route::post('feedbacks', [PublicController::class, 'submitFeedback']);
    // ── Auth ────────────────────────────────────────────────────────────────
    Route::post('admin/register', [AuthController::class, 'register']);
    Route::post('admin/login', [AuthController::class, 'login']);
    Route::post('admin/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::post('citizen/register', [AuthController::class, 'citizenRegister']);
    Route::post('citizen/login', [AuthController::class, 'citizenLogin']);

    // ── Citizen Submissions (Protected) ──────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('citizen/submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'index']);
        Route::post('citizen/submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'store']);
        Route::post('citizen/submissions/{id}/pay', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'pay']);
        
        Route::post('bookings', [BookingController::class, 'store']);
        Route::get('bookings', [BookingController::class, 'history']);
        Route::post('citizen/upload', [PublicController::class, 'upload']);
    });

    // ── Admin (Protected) ───────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'stats']);
        Route::get('me', [AuthController::class, 'me']);

        Route::get('citizen-submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'adminIndex']);
        Route::patch('citizen-submissions/{id}', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'adminUpdate']);

        Route::get('bookings', [BookingAdminController::class, 'index']);
        Route::patch('bookings/{id}/status', [BookingAdminController::class, 'updateStatus']);

        Route::get('bungalow-rooms', [BungalowRoomController::class, 'adminIndex']);
        Route::post('bungalow-rooms', [BungalowRoomController::class, 'store']);
        Route::put('bungalow-rooms/{id}', [BungalowRoomController::class, 'update']);
        Route::delete('bungalow-rooms/{id}', [BungalowRoomController::class, 'destroy']);

        Route::apiResource('hero-slides', HeroSlideController::class);
        Route::apiResource('leaders', LeaderController::class);
        Route::apiResource('announcements', AnnouncementController::class);
        Route::apiResource('news', NewsEventController::class);
        Route::apiResource('vacancies', VacancyController::class);
        Route::apiResource('documents', DocumentController::class);
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('condominiums', CondominiumController::class);
        Route::get('applications', [ApplicationController::class, 'index']);
        Route::get('applications/{id}', [ApplicationController::class, 'show']);
        Route::patch('applications/{id}/status', [ApplicationController::class, 'updateStatus']);
        Route::get('complaints', [ComplaintController::class, 'index']);
        Route::get('complaints/{id}', [ComplaintController::class, 'show']);
        Route::patch('complaints/{id}/reply', [ComplaintController::class, 'reply']);

        Route::get('feedbacks', [\App\Http\Controllers\Admin\FeedbackController::class, 'index']);
        Route::delete('feedbacks/{id}', [\App\Http\Controllers\Admin\FeedbackController::class, 'destroy']);

        Route::post('upload', [PublicController::class, 'upload']);
    });
});

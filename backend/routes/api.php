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
use App\Http\Controllers\Admin\ApplicationTariffController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Admin\BookingAdminController;
use App\Http\Controllers\Api\BungalowRoomController;

// ── Public API ──────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {
    Route::get('hero-slides', [PublicController::class, 'heroSlides']);
    Route::get('leaders', [PublicController::class, 'leaders']);
    Route::get('staff', [PublicController::class, 'staffMembers']);
    Route::get('announcements', [PublicController::class, 'announcements']);
    Route::get('news', [PublicController::class, 'news']);
    Route::get('bungalow-rooms', [BungalowRoomController::class, 'index']);
    Route::get('bookings/availability', [BookingController::class, 'getAvailability']);

    Route::get('news/{slug}', [PublicController::class, 'newsShow']);
    Route::get('vacancies', [PublicController::class, 'vacancies']);
    Route::post('vacancies/{id}/apply', [\App\Http\Controllers\Admin\JobApplicationController::class, 'store']);
    Route::get('documents', [PublicController::class, 'documents']);
    Route::get('projects', [PublicController::class, 'projects']);
    Route::get('condominiums', [PublicController::class, 'condominiums']);
    Route::get('application-tariffs', [PublicController::class, 'applicationTariffs']);
    Route::get('application-forms', [PublicController::class, 'applicationForms']);
    Route::get('mc-fees', [\App\Http\Controllers\Admin\McFeeController::class, 'index']);
    Route::post('applications', [PublicController::class, 'submitApplication']);
    Route::post('complaints', [PublicController::class, 'submitComplaint']);
    Route::post('feedbacks', [PublicController::class, 'submitFeedback']);
    Route::post('translate', [PublicController::class, 'translate']);

    // --- Public Certificate Routes ---
    Route::get('certificates', [\App\Http\Controllers\Api\CertificateController::class, 'index']);
    Route::get('certificates/{id}', [\App\Http\Controllers\Api\CertificateController::class, 'show'])->where('id', '[0-9]+');

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

        // --- Citizen Protected Certificate Routes ---
        Route::post('certificates/{id}/initiate-payment', [\App\Http\Controllers\Api\CertificateController::class, 'initiatePayment'])->where('id', '[0-9]+');
        Route::post('certificates/payments/{ref}/complete', [\App\Http\Controllers\Api\CertificateController::class, 'completePayment']);
        Route::get('certificates/payments/{ref}/status', [\App\Http\Controllers\Api\CertificateController::class, 'paymentStatus']);
        Route::get('certificates/my-payments', [\App\Http\Controllers\Api\CertificateController::class, 'myPayments']);
    });


    // ── Admin (Protected) ───────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'stats']);
        Route::get('me', [AuthController::class, 'me']);

        Route::get('citizen-submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'adminIndex']);
        Route::patch('citizen-submissions/{id}', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'adminUpdate']);

        Route::get('bookings', [BookingAdminController::class, 'index']);
        Route::post('bookings', [BookingAdminController::class, 'store']);
        Route::patch('bookings/{id}/status', [BookingAdminController::class, 'updateStatus']);

        Route::get('bungalow-rooms', [BungalowRoomController::class, 'adminIndex']);
        Route::post('bungalow-rooms', [BungalowRoomController::class, 'store']);
        Route::put('bungalow-rooms/{id}', [BungalowRoomController::class, 'update']);
        Route::delete('bungalow-rooms/{id}', [BungalowRoomController::class, 'destroy']);

        Route::apiResource('hero-slides', HeroSlideController::class);
        Route::apiResource('leaders', LeaderController::class);
        Route::apiResource('staff-members', \App\Http\Controllers\Admin\StaffMemberController::class);
        Route::apiResource('announcements', AnnouncementController::class);
        Route::apiResource('news', NewsEventController::class);
        Route::apiResource('vacancies', VacancyController::class);
        Route::apiResource('documents', DocumentController::class);
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('condominiums', CondominiumController::class);
        Route::apiResource('application-tariffs', ApplicationTariffController::class);
        Route::apiResource('application-forms', \App\Http\Controllers\Admin\ApplicationFormController::class);
        Route::get('applications', [ApplicationController::class, 'index']);
        Route::get('applications/{id}', [ApplicationController::class, 'show']);
        Route::patch('applications/{id}/status', [ApplicationController::class, 'updateStatus']);
        Route::get('complaints', [ComplaintController::class, 'index']);
        Route::get('complaints/{id}', [ComplaintController::class, 'show']);
        Route::patch('complaints/{id}/reply', [ComplaintController::class, 'reply']);

        Route::get('feedbacks', [\App\Http\Controllers\Admin\FeedbackController::class, 'index']);
        Route::delete('feedbacks/{id}', [\App\Http\Controllers\Admin\FeedbackController::class, 'destroy']);

        Route::get('job-applications', [\App\Http\Controllers\Admin\JobApplicationController::class, 'index']);
        Route::delete('job-applications/{id}', [\App\Http\Controllers\Admin\JobApplicationController::class, 'destroy']);

        // --- Certificate Admin Routes ---
        Route::get('certificate-types', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'typesIndex']);
        Route::post('certificate-types', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'typesStore']);
        Route::get('certificate-types/{id}', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'typesShow']);
        Route::put('certificate-types/{id}', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'typesUpdate']);
        Route::delete('certificate-types/{id}', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'typesDestroy']);

        Route::get('certificate-documents', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'docsIndex']);
        Route::post('certificate-documents', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'docsStore']);
        Route::get('certificate-documents/{id}', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'docsShow']);
        Route::put('certificate-documents/{id}', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'docsUpdate']);
        Route::delete('certificate-documents/{id}', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'docsDestroy']);

        Route::get('certificate-payments', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'paymentsIndex']);

        Route::post('upload', [PublicController::class, 'upload']);
        Route::get('mc-fees/settings', [\App\Http\Controllers\Admin\McFeeController::class, 'getSettings']);
        Route::post('mc-fees/settings', [\App\Http\Controllers\Admin\McFeeController::class, 'updateSettings']);
        Route::apiResource('mc-fees', \App\Http\Controllers\Admin\McFeeController::class);
    });
});

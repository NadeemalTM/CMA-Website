<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LawController;
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
Route::prefix('v1')->middleware('audit')->group(function () {
    Route::get('hero-slides', [PublicController::class, 'heroSlides']);
    Route::get('leaders', [PublicController::class, 'leaders']);
    Route::get('staff', [PublicController::class, 'staffMembers']);
    Route::get('announcements', [PublicController::class, 'announcements']);
    Route::get('news', [PublicController::class, 'news']);
    Route::get('bungalow-rooms', [BungalowRoomController::class, 'index']);
    Route::get('bungalow-hero-images', [BungalowRoomController::class, 'heroImages']);
    Route::get('bookings/availability', [BookingController::class, 'getAvailability']);
    Route::get('bookings/settings', [BookingController::class, 'settings']);
    Route::post('bookings/supporting-document', [BookingController::class, 'uploadSupportingDocument'])->middleware('throttle:5,1');
    Route::post('bookings', [BookingController::class, 'store'])->middleware('throttle:10,1');
    Route::post('bookings/status', [BookingController::class, 'status'])->middleware('throttle:30,1');

    Route::get('news/{slug}', [PublicController::class, 'newsShow']);
    Route::get('vacancies', [PublicController::class, 'vacancies']);
    Route::post('vacancies/{id}/apply', [\App\Http\Controllers\Admin\JobApplicationController::class, 'store']);
    Route::get('documents', [PublicController::class, 'documents']);
    Route::get('laws', [\App\Http\Controllers\LawController::class, 'index']);
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
    Route::get('certificates/settings', [\App\Http\Controllers\Api\CertificateController::class, 'settings']);
    Route::get('certificates', [\App\Http\Controllers\Api\CertificateController::class, 'index']);
    Route::get('certificates/{id}', [\App\Http\Controllers\Api\CertificateController::class, 'show'])->where('id', '[0-9]+');

    // ── Auth ────────────────────────────────────────────────────────────────
    Route::post('admin/register', [AuthController::class, 'register'])
        ->middleware(['auth:sanctum', 'admin', 'super.admin']);
    Route::post('admin/login', [AuthController::class, 'login']);
    Route::post('admin/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::post('citizen/register', [AuthController::class, 'citizenRegister']);
    Route::post('citizen/login', [AuthController::class, 'citizenLogin']);

    // ── Citizen Submissions (Protected) ──────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('citizen/me', [AuthController::class, 'me']);
        Route::post('citizen/me/profile-picture', [AuthController::class, 'uploadProfilePicture']);
        Route::get('citizen/submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'index']);
        Route::post('citizen/submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'store']);
        Route::post('citizen/submissions/{id}/pay', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'pay']);
        
        Route::get('bookings', [BookingController::class, 'history']);
        Route::post('citizen/upload', [PublicController::class, 'upload']);

        // --- Citizen Protected Certificate Routes ---
        Route::post('certificates/{id}/initiate-payment', [\App\Http\Controllers\Api\CertificateController::class, 'initiatePayment'])->where('id', '[0-9]+');
        Route::post('certificates/payments/{ref}/complete', [\App\Http\Controllers\Api\CertificateController::class, 'completePayment']);
        Route::get('certificates/payments/{ref}/status', [\App\Http\Controllers\Api\CertificateController::class, 'paymentStatus']);
        Route::get('certificates/payments/{ref}/documents/{documentId}/download', [\App\Http\Controllers\Api\CertificateController::class, 'download']);
        Route::get('certificates/my-payments', [\App\Http\Controllers\Api\CertificateController::class, 'myPayments']);
        
        // --- Citizen Complaints Routes ---
        Route::get('citizen/complaints', [PublicController::class, 'citizenComplaints']);
        Route::post('citizen/complaints', [PublicController::class, 'submitCitizenComplaint']);
        Route::delete('citizen/complaints/{id}', [PublicController::class, 'deleteCitizenComplaint']);
    });


    // ── Admin (Protected) ───────────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('me', [AuthController::class, 'me']);

        Route::middleware('super.admin')->group(function () {
            Route::get('admin-users', [\App\Http\Controllers\Admin\AdminUserController::class, 'index']);
            Route::post('admin-users', [\App\Http\Controllers\Admin\AdminUserController::class, 'store']);
            Route::put('admin-users/{user}', [\App\Http\Controllers\Admin\AdminUserController::class, 'update']);
            Route::patch('admin-users/{user}/status', [\App\Http\Controllers\Admin\AdminUserController::class, 'updateStatus']);
        });

        Route::get('dashboard', [DashboardController::class, 'stats'])
            ->middleware('admin.permission:dashboard');

        Route::get('history', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])
            ->middleware('admin.permission:history');

        Route::middleware('admin.permission:citizens')->group(function () {
            Route::get('citizens', [DashboardController::class, 'citizens']);
            Route::delete('citizens/{id}', [DashboardController::class, 'destroyCitizen']);
            Route::patch('citizens/{id}/reset-password', [DashboardController::class, 'resetCitizenPassword']);
        });

        Route::middleware('admin.permission:citizen_submissions')->group(function () {
            Route::get('citizen-submissions', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'adminIndex']);
            Route::patch('citizen-submissions/{id}', [\App\Http\Controllers\Api\CitizenSubmissionController::class, 'adminUpdate']);
        });

        Route::middleware('admin.permission:bookings')->group(function () {
            Route::get('bookings', [BookingAdminController::class, 'index']);
            Route::post('bookings', [BookingAdminController::class, 'store']);
            Route::patch('bookings/{id}/status', [BookingAdminController::class, 'updateStatus']);
            Route::patch('bookings/{id}/payment-status', [BookingAdminController::class, 'updatePaymentStatus']);
            Route::get('bookings/settings', [BookingAdminController::class, 'settings']);
            Route::put('bookings/settings', [BookingAdminController::class, 'updateSettings']);
        });

        Route::middleware('admin.permission:bungalow_rooms')->group(function () {
            Route::get('bungalow-rooms', [BungalowRoomController::class, 'adminIndex']);
            Route::post('bungalow-rooms', [BungalowRoomController::class, 'store']);
            Route::put('bungalow-rooms/{id}', [BungalowRoomController::class, 'update']);
            Route::delete('bungalow-rooms/{id}', [BungalowRoomController::class, 'destroy']);
            Route::get('bungalow-hero-images', [BungalowRoomController::class, 'adminHeroImages']);
            Route::put('bungalow-hero-images/{slot}', [BungalowRoomController::class, 'updateHeroImage']);
        });

        Route::apiResource('hero-slides', HeroSlideController::class)->middleware('admin.permission:hero_slides');
        Route::apiResource('leaders', LeaderController::class)->middleware('admin.permission:leadership');
        Route::apiResource('staff-members', \App\Http\Controllers\Admin\StaffMemberController::class)->middleware('admin.permission:staff');
        Route::apiResource('announcements', AnnouncementController::class)->middleware('admin.permission:announcements');
        Route::apiResource('news', NewsEventController::class)->middleware('admin.permission:news');
        Route::apiResource('vacancies', VacancyController::class)->middleware('admin.permission:vacancies');
        Route::apiResource('documents', DocumentController::class)->middleware('admin.permission:documents');

        Route::middleware('admin.permission:laws')->group(function () {
            Route::get('laws', [LawController::class, 'index']);
            Route::post('laws', [LawController::class, 'store']);
            Route::post('laws/{id}', [LawController::class, 'update']);
            Route::delete('laws/{id}', [LawController::class, 'destroy']);
        });
        Route::apiResource('projects', ProjectController::class)->middleware('admin.permission:projects');
        Route::apiResource('condominiums', CondominiumController::class)->middleware('admin.permission:condominiums');
        Route::apiResource('application-tariffs', ApplicationTariffController::class)->middleware('admin.permission:application_tariffs');
        Route::apiResource('application-forms', \App\Http\Controllers\Admin\ApplicationFormController::class)->middleware('admin.permission:application_forms');

        Route::middleware('admin.permission:applications')->group(function () {
            Route::get('applications', [ApplicationController::class, 'index']);
            Route::get('applications/{id}', [ApplicationController::class, 'show']);
            Route::patch('applications/{id}/status', [ApplicationController::class, 'updateStatus']);
        });

        Route::middleware('admin.permission:complaints')->group(function () {
            Route::get('complaints', [ComplaintController::class, 'index']);
            Route::get('complaints/{id}', [ComplaintController::class, 'show']);
            Route::patch('complaints/{id}/reply', [ComplaintController::class, 'reply']);
            Route::delete('complaints/{id}', [ComplaintController::class, 'destroy']);
        });

        Route::middleware('admin.permission:feedbacks')->group(function () {
            Route::get('feedbacks', [\App\Http\Controllers\Admin\FeedbackController::class, 'index']);
            Route::delete('feedbacks/{id}', [\App\Http\Controllers\Admin\FeedbackController::class, 'destroy']);
        });

        Route::middleware('admin.permission:job_applications')->group(function () {
            Route::get('job-applications', [\App\Http\Controllers\Admin\JobApplicationController::class, 'index']);
            Route::delete('job-applications/{id}', [\App\Http\Controllers\Admin\JobApplicationController::class, 'destroy']);
        });

        // --- Certificate Admin Routes ---
        Route::middleware('admin.permission:certificates')->group(function () {
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
            Route::patch('certificate-payments/{id}/status', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'updatePaymentStatus']);

            Route::get('certificate-settings', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'getSettings']);
            Route::post('certificate-settings', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'updateSettings']);
            Route::put('certificate-settings', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'updateSettings']);
            Route::get('certificates/settings', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'getSettings']);
            Route::post('certificates/settings', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'updateSettings']);
            Route::put('certificates/settings', [\App\Http\Controllers\Admin\CertificateAdminController::class, 'updateSettings']);
        });

        Route::post('upload', [PublicController::class, 'upload']);
        Route::middleware('admin.permission:mc_fees')->group(function () {
            Route::get('mc-fees/settings', [\App\Http\Controllers\Admin\McFeeController::class, 'getSettings']);
            Route::post('mc-fees/settings', [\App\Http\Controllers\Admin\McFeeController::class, 'updateSettings']);
            Route::apiResource('mc-fees', \App\Http\Controllers\Admin\McFeeController::class);
        });
    });
});

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->string('subtitle_si')->nullable();
            $table->string('subtitle_ta')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_si')->nullable();
            $table->text('description_ta')->nullable();
            $table->string('image')->nullable();
            $table->string('button_text_en')->nullable();
            $table->string('button_text_si')->nullable();
            $table->string('button_text_ta')->nullable();
            $table->string('button_link')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('leaders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position_en');
            $table->string('position_si')->nullable();
            $table->string('position_ta')->nullable();
            $table->text('bio_en')->nullable();
            $table->text('bio_si')->nullable();
            $table->text('bio_ta')->nullable();
            $table->string('photo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->text('text_en');
            $table->text('text_si')->nullable();
            $table->text('text_ta')->nullable();
            $table->string('link')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('news_events', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->longText('body_en')->nullable();
            $table->longText('body_si')->nullable();
            $table->longText('body_ta')->nullable();
            $table->string('excerpt_en')->nullable();
            $table->string('excerpt_si')->nullable();
            $table->string('excerpt_ta')->nullable();
            $table->string('image')->nullable();
            $table->string('category')->default('news'); // news, event, announcement
            $table->string('slug')->unique();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->longText('description_en')->nullable();
            $table->longText('description_si')->nullable();
            $table->longText('description_ta')->nullable();
            $table->date('deadline')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->string('type'); // law, publication, form, gazette, annual_report
            $table->string('category')->nullable();
            $table->string('file_path');
            $table->string('language')->default('en'); // en, si, ta, all
            $table->integer('year')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->longText('description_en')->nullable();
            $table->longText('description_si')->nullable();
            $table->longText('description_ta')->nullable();
            $table->string('image')->nullable();
            $table->string('status')->default('ongoing'); // ongoing, completed, planned
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('condominiums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('registration_no')->unique();
            $table->string('address')->nullable();
            $table->string('district')->nullable();
            $table->string('city')->nullable();
            $table->integer('unit_count')->nullable();
            $table->string('developer_name')->nullable();
            $table->string('mc_name')->nullable();
            $table->string('mc_registration_no')->nullable();
            $table->string('status')->default('registered'); // registered, pending, cancelled
            $table->date('registered_at')->nullable();
            $table->timestamps();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique();
            $table->string('applicant_name');
            $table->string('email');
            $table->string('phone');
            $table->string('type'); // condo_plan, mc_registration, amendment, other
            $table->json('form_data')->nullable();
            $table->string('status')->default('pending'); // pending, processing, approved, rejected
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('new'); // new, reviewed, resolved
            $table->text('reply')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('condominiums');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('vacancies');
        Schema::dropIfExists('news_events');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('leaders');
        Schema::dropIfExists('hero_slides');
    }
};

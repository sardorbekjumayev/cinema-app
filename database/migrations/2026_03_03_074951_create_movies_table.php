<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('genres')->nullable(); // Tarjima kinolar / Sarguzasht ...
            $table->string('country')->nullable(); // Rossiya
            $table->integer('year')->nullable(); // 2024
            $table->string('language')->nullable(); // O'zbekcha
            $table->string('duration')->nullable(); // 1soat 25daq
            $table->string('age_limit')->nullable(); // Cheklangan yosh
            $table->string('poster')->nullable(); // Avatar image
            $table->string('video_path')->nullable(); // Original path
            $table->json('versions')->nullable(); // Transcoded versions (720p, 1080p, etc)
            $table->string('status')->default('pending'); // Transcoding status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};

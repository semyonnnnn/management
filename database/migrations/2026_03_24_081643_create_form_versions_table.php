<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('form_versions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_id');
            $table->unsignedBigInteger('form_id'); // FK to forms
            $table->timestamps();

            $table->foreign('dataset_id')->references('id')->on('versions')->onDelete('cascade');
            $table->foreign('form_id')->references('id')->on('forms')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_versions');
    }
};
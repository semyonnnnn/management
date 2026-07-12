<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_okved', function (Blueprint $table) {
            $table->id();

            // Foreign keys connecting to forms and okveds tables
            $table->foreignId('form_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('okved_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('version_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamps();

            // Prevent duplicate entries for the same form and okved combination
            $table->unique(['form_id', 'okved_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_okved');
    }
};
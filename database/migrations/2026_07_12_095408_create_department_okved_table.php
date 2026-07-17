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
        Schema::create('department_okved', function (Blueprint $table) {
            $table->id();

            $table->foreignId('department_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('okved_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('version_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['department_id', 'okved_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_okved');
    }
};
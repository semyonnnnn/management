<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('versions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('version_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('territory');
            $table->integer('staff')->default(0);
            $table->timestamps();
        });

        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('version_id')->constrained()->cascadeOnDelete();

            $table->string('okud');
            $table->string('name', 60);

            $table->integer('indicators')->default(0);

            $table->decimal('k1', 8, 2)->default(1);
            $table->decimal('k2', 8, 2)->default(1);
            $table->decimal('k3', 8, 2)->default(1);
            $table->decimal('k4', 8, 2)->default(1);
            $table->decimal('k5', 8, 2)->default(1);
            $table->decimal('k6', 8, 2)->default(1);

            $table->timestamps();
        });

        Schema::create('assignments', function (Blueprint $table) {

            $table->id();

            $table->foreignId('department_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('form_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->integer('indicators')->default(0);
            $table->integer('reports')->default(1);

            $table->timestamps();

            $table->unique(['department_id', 'form_id']);
        });

        Schema::create('shr_versions', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->foreignId('base_version_id')
                ->constrained('versions')
                ->cascadeOnDelete();

            $table->json('departments_snapshot');
            $table->json('assignments_snapshot')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shr_versions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('forms');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('versions');
    }
};
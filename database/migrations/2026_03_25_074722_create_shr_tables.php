<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        // Only table tracking uploads / manual saves
        Schema::create('versions', function (Blueprint $table) {
            $table->id();
            $table->boolean('isCurrent');
            $table->string('name');
            $table->timestamps();
        });

        // Departments are independent of versions
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('territory');
            $table->integer('staff')->default(0);
            $table->integer('workload');
            $table->foreignId('versions_id')->constrained();
            $table->timestamps();
        });

        // Forms are independent of versions
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->integer('indicators')->default(0);
            $table->integer('reports')->default(1);
            $table->decimal('coeff', 8, 2)->default(1.0);
            $table->integer('final')->default(0);
            $table->foreignId('department_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete(); // department can be null if missing
            $table->foreignId('versions_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forms');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('versions');
    }
};
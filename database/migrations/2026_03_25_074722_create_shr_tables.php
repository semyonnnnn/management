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
            $table->string('name', 60);
            $table->integer('indicators');
            $table->integer('reports');
            $table->decimal('coeff', 8, 2)->default(1);
            $table->integer('final');
            $table->foreignId('department_id')->constrained();
            $table->foreignId('versions_id')->constrained();
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
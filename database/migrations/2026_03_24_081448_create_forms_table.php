<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_id');
            $table->unsignedBigInteger('dep_id'); // FK to departments
            $table->string('name');
            $table->integer('indicators');
            $table->integer('reports');
            $table->decimal('coeff', 8, 2);
            $table->integer('final');
            $table->timestamps();

            $table->foreign('dataset_id')->references('id')->on('versions')->onDelete('cascade');
            $table->foreign('dep_id')->references('id')->on('departments')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};
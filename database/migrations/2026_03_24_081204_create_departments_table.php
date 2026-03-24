<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_id');
            $table->integer('row_id');
            $table->string('dep_name');
            $table->string('terr');
            $table->integer('staff');
            $table->decimal('total_workload', 8, 2);
            $table->timestamps();

            $table->foreign('dataset_id')->references('id')->on('versions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
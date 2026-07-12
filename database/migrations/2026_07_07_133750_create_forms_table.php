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
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->integer('total')->default(0);
            $table->integer('indicators')->default(0);

            // Decimal is used for k1-k6 assuming they are coefficients/multipliers like the original 'coeff'
            $table->decimal('k1', 8, 2)->default(1.0);
            $table->decimal('k2', 8, 2)->default(1.0);
            $table->decimal('k3', 8, 2)->default(1.0);
            $table->decimal('k4', 8, 2)->default(1.0);
            $table->decimal('k5', 8, 2)->default(1.0);
            $table->decimal('k6', 8, 2)->default(1.0);

            $table->foreignId('version_id')
                ->constrained()
                ->cascadeOnDelete();

            // Converted to snake_case (is_consolidated) to match Laravel database conventions
            $table->boolean('is_consolidated')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};
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
        Schema::create('allergen_ingridients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ingridient_id')
                ->constrained('ingridients')
                ->onDelete('cascade');

            $table->foreignId('allergen_id')
                ->constrained('allergens')
                ->onDelete('cascade');
                
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allergen_ingridients');
    }
};

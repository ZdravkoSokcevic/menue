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
        Schema::create('extra_ingridients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('extra_id')
                ->constrained('extras')
                ->onDelete('cascade');

            $table->foreignId('ingridient_id')
                ->constrained('ingridients')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extra_ingridients');
    }
};

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
        Schema::create('combos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('price_id')
                ->constrained('prices')
                ->onDelete('cascade');
            $table->integer('active')->default(1)->index('id_active_index');
            // TODO: Get active times - 
            // 1) every day in specific time
            // 2) weekly at specific times
            // 3) null for all the time
            $table->string('active_times')->nullable();
            $table->time('time_from')->nullable();
            $table->time('time_to')->nullable();

            // TODO: active dates
            $table->date('start_at')->nullable();
            $table->date('end_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combos');
    }
};

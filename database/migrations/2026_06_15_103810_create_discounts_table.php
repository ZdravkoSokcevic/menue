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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')
                ->constrained('menus')
                ->onDelete('cascade');
            $table->foreignId('portion_id')
                ->constrained('portions')
                ->onDelete('cascade');    
            $table->enum('type', ['percent', 'fixed'])->default('percent');
            $table->decimal('value', 4)->default(0);

            // Get active times - 
            // 0) null for all the time
            // 1) every day in specific time
            // 2) weekly at specific times
            $table->tinyInteger('active_times')->nullable();
            // for every day - value daily
            // for weekly, ex- mo,tu,fr
            $table->string('times')->nullable();
            $table->time('time_from')->nullable();
            $table->time('time_to')->nullable();

            // IF NULL start_at and end_at
            // then discount is always active
            $table->date('start_at')->nullable();
            $table->date('end_at')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};

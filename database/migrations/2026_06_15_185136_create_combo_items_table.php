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
        Schema::create('combo_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combo_id')
                ->constrained('combos')
                ->onDelete('cascade');
            $table->foreignId('menu_id')
                ->constrained('menus')
                ->onDelete('cascade');
            $table->foreignId('portion_id')
                ->constrained('portions')
                ->onDelete('cascade');

            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combo_items');
    }
};

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
        Schema::create('order_modifications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_item_id')
                ->constrained('order_items')
                ->index()
                ->onDelete('cascade');

            // menu_prices table, we can load extras and preferences for menu
            $table->bigInteger('menu_extras_id')
                ->constrained('menu_extras')
                ->nullable();
            // Extras used and related to this order
            $table->bigInteger('menu_preferences_id')
                ->constrained('menu_preferences')
                ->nullable();
            // Preferences used and related to this order - menu_preferences_id
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_modifications');
    }
};

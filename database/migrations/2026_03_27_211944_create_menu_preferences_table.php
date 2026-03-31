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
        Schema::create('menu_preferences', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('menu_id')->unsigned()->nullable()->index();
            $table->bigInteger('preference_id')->unsigned()->nullable()->index();
            $table->timestamps();
        });
        Schema::table('menu_preferences', function (Blueprint $table) { 
            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('preference_id')
                ->references('id')
                ->on('preferences')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_preferences', function (Blueprint $table) { 
            $table->dropForeign('menu_id');
            $table->dropForeign('preference_id');
         });
        Schema::dropIfExists('menu_preferences');
    }
};

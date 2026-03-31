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
        Schema::create('portions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('menu_id')
                ->unsigned()
                ->nullable()
                ->index();
            $table->integer('portion_size')
                ->nullable();
            $table->bigInteger('currency_id')
                ->unsigned()
                ->nullable()
                ->index();
            $table->bigInteger('price_id')
                ->unsigned()
                ->nullable()
                ->index();
            $table->timestamps();
        });
        Schema::table('portions', function (Blueprint $table) { 
            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('price_id')
                ->references('id')
                ->on('prices')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portions', function (Blueprint $table) {
            $table->dropForeign('menu_id');
            $table->dropForeign('price_id');
        });
        Schema::dropIfExists('portions');
    }
};

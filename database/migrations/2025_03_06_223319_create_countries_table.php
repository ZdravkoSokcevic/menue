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
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('common_name');
            $table->string('name')->index();
            $table->string('flag')->nullable();
            $table->string('flag_png')->nullable();
            $table->string('flag_svg')->nullable();
            $table->string('region')->nullable();
            $table->string('tld')->nullable();
            $table->tinyInteger('frequent')
                ->default(0)
                ->index();
            // This rows every translation must have
            $table->tinyInteger('mandatory')
                ->default(0)
                ->index();
            $table->tinyInteger('use_imperial')
                ->default(0)
                ->index();
            // virtual foreign main language
            $table->bigInteger('language_id')
                ->unsigned()
                ->nullable()
                ->index();
            // virtual foreign main currency
            $table->bigInteger('currency_id')
                ->unsigned()
                ->nullable()
                ->index();
            $table->timestamps();
        });

        Schema::table('countries', function(Blueprint $table) {
            // main language and main currency
            $table->foreign('currency_id')
                ->references('id')
                ->on('currencies')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('language_id')
                ->references('id')
                ->on('languages')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('countries', function (Blueprint $table) {
            $table->dropForeign(['currency_id']);
            $table->dropForeign(['language_id']);
        });   
        Schema::dropIfExists('countries');
    }
};

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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->text('description')->nullable();
            // Not added yet, add later
            $table->string('logo')->nullable();
            $table->string('phone')->nullable();
            $table->string('location_lat')->nullable();
            $table->string('location_lng')->nullable();
            $table->string('street')->nullable();
            $table->string('website')->nullable();
            $table->bigInteger('language_id')->unsigned()->nullable();
            $table->bigInteger('currency_id')->unsigned()->nullable();
            $table->bigInteger('country_id')->unsigned()->nullable();
            $table->bigInteger('license_id')->unsigned()->nullable();

            // Make sure to know who created company
            $table->bigInteger('creator_id')->nullable()->unsigned();

            // Need to add Settings by company (theme, colors, default lang ? (maybe that can be choosed per user), )
            $table->timestamps();
        });

        // avoid circular relations
        Schema::table('companies', function (Blueprint $table) {
            $table->foreign('creator_id')
                ->references('id')
                ->on('users')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('language_id')
                ->references('id')
                ->on('languages')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('currency_id')
                ->references('id')
                ->on('currencies')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('country_id')
                ->references('id')
                ->on('countries')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('license_id')
                ->references('id')
                ->on('licenses')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign('creator_id');
            $table->dropForeign('language_id');
            $table->dropForeign('currency_id');
            $table->dropForeign('country_id');
            $table->dropForeign('license_id');

        });
        Schema::dropIfExists('companies');
    }
};

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
        Schema::create('ingridients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_vegan');
            $table->bigInteger('company_id')->unsigned()->nullable();
            $table->timestamps();
        });

        Schema::table('ingridients', function (Blueprint $table) {
            $table->foreign('company_id')
                ->references('id')
                ->on('companies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingridients');
    }
};

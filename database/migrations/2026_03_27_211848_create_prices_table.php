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
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->integer('price');
            $table->string('name');
            $table->bigInteger('currency_id')->unsigned()->nullable();
            // default menu type
            $table->tinyInteger('type')->default(1);
            $table->timestamps();
        });

        Schema::table('prices', function (Blueprint $table) {
            $table->foreign('currency_id')
                ->references('id')
                ->on('currencies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prices', function (Blueprint $table) {
            $table->dropForeign('currency_id');
        });
        Schema::dropIfExists('prices');
    }
};

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
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('key');
            $table->text('value');
            $table->string('model');
            $table->string('model_id');
            $table->string('model_class');
            $table->string('locale',2)->nullable();
            $table->timestamps();
            $table->unique([ 'model', 'model_id',  'locale', 'key']);
            $table->bigInteger('language_id')->unsigned()->nullable();
        });

        Schema::table('translations', function (Blueprint $table) {
            $table->foreign('language_id')
                ->references('id')
                ->on('languages'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};

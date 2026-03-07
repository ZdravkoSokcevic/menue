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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('picture')->nullable();
            $table->bigInteger('parent_id')->unsigned()->nullable();
            $table->bigInteger('company_id')->unsigned()->nullable();
            $table->timestamps();
        });
        Schema::table('categories', function(Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('categories')->onUpdate('set null')->onDelete('cascade');
            $table->foreign(columns: 'company_id')->references('id')->on('companies')->onUpdate('set null')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function(Blueprint $table) {
            $table->dropForeign('parent_id');
            $table->dropForeign('company_id');
        });
        Schema::dropIfExists('categories');
    }
};

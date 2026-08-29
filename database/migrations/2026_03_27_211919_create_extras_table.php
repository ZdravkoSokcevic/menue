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
        Schema::create('extras', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('price')->nullable();
            $table->bigInteger('company_id')->unsigned()->nullable();
            $table->timestamps();
        });

        Schema::table('extras', function (Blueprint $table) {
            $table->foreign('company_id')
                ->references('id')
                ->on('companies')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extras');
    }
};

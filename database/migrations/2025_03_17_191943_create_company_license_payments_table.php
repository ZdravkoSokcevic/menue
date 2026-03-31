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
        Schema::create('company_license_payments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('company_id')
                ->unsigned()
                ->index();
            $table->integer('amount');
            $table->dateTime('date');
            $table->timestamps();
        });
        Schema::table('company_license_payments', function($table) {
            $table->foreign('company_id')->references('id')->on('companies')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_license_payments');
    }
};

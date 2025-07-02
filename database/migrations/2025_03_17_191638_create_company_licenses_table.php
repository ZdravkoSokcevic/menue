<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Company;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_licenses', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('company_id')->unsigned();
            $table->bigInteger('license_id')->unsigned();
            $table->dateTime('valid_until');
            $table->timestamps();
        });
        Schema::table('company_licenses', function($table) {
            $table->foreign('company_id')->references('id')->on('companies')->cascadeOnDelete();
            $table->foreign('license_id')->references('id')->on('licenses')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_licenses', function($table) {
            $table->dropForeign('company_id');
            $table->dropForeign('license_id');
        });
        Schema::dropIfExists('company_licenses');
    }
};

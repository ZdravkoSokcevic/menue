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
        Schema::create('tables', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
             $table->bigInteger('company_id')->unsigned()->index();
            $table->boolean('availability')->default(1);
            $table->string('name')->nullable(false);

            $table->timestamps();
        });

        Schema::table('tables', function($table) {
            $table->engine = 'InnoDB';
            // $table->foreignIdFor(Companies::class)->constrained();
            $table->foreign('company_id')->references('id')->on('companies')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tables', function($table) {
            $table->dropForeign('company_id');
        });
        Schema::dropIfExists('tables');
    }
};

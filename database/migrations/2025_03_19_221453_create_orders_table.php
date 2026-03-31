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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('slug')->unique()->index();
            // User who confirm and processed order
            $table->bigInteger('waiter_id')->unsigned()->nullable();
            $table->time('order_received_at')->nullable();
            $table->time('order_processed_at')->nullable();
            // Prep time is calculated per order
            $table->integer('prep_time')->nullable();
            // 0 - ordered / unprocessed
            // 1 - ordered / processed
            // 2 - processed / finished
            // 3 - paid
            $table->string('status')->default(0)->index();
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('waiter_id')
                ->references('id')
                ->on('users')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign('waiter_id');
        });
        Schema::dropIfExists('orders');
    }
};

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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('order_id')
                ->unsigned()
                ->nullable()
                ->index();
            $table->bigInteger('menu_id')
                ->unsigned()
                ->nullable();
            $table->bigInteger('portion_id')
                ->unsigned()
                ->nullable();
            $table->integer('quantity')
                ->nullable();
            $table->enum('status', ['ordered', 'inprgress', 'finished'])
                ->default('ordered');
            $table->string('prep_time')
                ->nullable();

            $table->bigInteger('table_id')
                ->unsigned()
                ->nullable();


            // $table->unique([ 'order_id', 'order_portion_id', 'order_extras_id', 'order_preferences_id' ]);
            $table->string('note')->nullable();
            

            $table->timestamps();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('table_id')
                ->references('id')
                ->on('tables')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // $table->dropUnique((['order_id', 'order_portion_id', 'order_extras_id']));
        });
        Schema::dropIfExists('order_items');
    }
};

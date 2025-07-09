<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand')->default('Toyota');
            $table->string('model');
            $table->decimal('price', 10, 2);
            $table->text('description');
            $table->json('specifications')->nullable();
            $table->json('images')->nullable();
            $table->string('fuel_type');
            $table->string('transmission');
            $table->integer('year');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cars');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'referrer', 'referee'])->default('referrer');
            $table->string('referral_code')->unique();
            $table->unsignedBigInteger('referred_by')->nullable();
            $table->integer('points')->default(0);
            $table->string('phone')->nullable();
            $table->string('google_id')->nullable();
            $table->string('facebook_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->foreign('referred_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};

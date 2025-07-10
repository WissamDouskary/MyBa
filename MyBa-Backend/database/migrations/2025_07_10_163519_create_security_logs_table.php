<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('security_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('action', 100); // login, logout, password_change, failed_login, etc.
            $table->ipAddress('ip_address')->nullable();
            $table->text('device_info')->nullable();
            $table->text('user_agent')->nullable();
            $table->enum('status', ['success', 'failed', 'blocked']);
            $table->json('additional_data')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index(['user_id', 'action']);
            $table->index(['action', 'status']);
            $table->index('created_at');
            $table->index('ip_address');
        });
    }

    public function down()
    {
        Schema::dropIfExists('security_logs');
    }
};
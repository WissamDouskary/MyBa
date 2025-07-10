<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('beneficiary_name', 200);
            $table->string('account_number', 20);
            $table->string('bank_name', 200);
            $table->string('bank_code', 20)->nullable();
            $table->string('routing_number', 20)->nullable();
            $table->enum('beneficiary_type', ['personal', 'business'])->default('personal');
            $table->boolean('is_favorite')->default(false);
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'is_favorite']);
            $table->index('account_number');
        });
    }

    public function down()
    {
        Schema::dropIfExists('beneficiaries');
    }
};
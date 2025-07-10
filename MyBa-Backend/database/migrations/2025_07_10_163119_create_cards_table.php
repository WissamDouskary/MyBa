<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->string('card_number', 19); // Will be encrypted
            $table->enum('card_type', ['debit', 'credit']);
            $table->string('card_name', 100)->nullable();
            $table->integer('expiry_month');
            $table->integer('expiry_year');
            $table->string('cvv', 4)->nullable(); // Will be encrypted
            $table->decimal('card_limit', 15, 2)->nullable();
            $table->decimal('available_limit', 15, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_blocked')->default(false);
            $table->timestamps();
            
            // Indexes
            $table->index('account_id');
            $table->index(['account_id', 'is_active']);
            $table->index(['card_type', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cards');
    }
};